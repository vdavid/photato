export default class OrientationFixer {
  async determineOrientation(file: File): Promise<number> {
    const data = await this._readFileToArrayBuffer(file)
    const dataView = new DataView(data)
    return this._isJpegFile(data, dataView) ? this._getOrientationValueFromJpegData(dataView) || 1 : 1
  }

  getCssTransformationByOrientationValue(orientation: number): string | undefined {
    const map: Partial<Record<number, string>> = {
      1: '',
      2: 'rotateY(180deg)',
      3: 'rotate(180deg)',
      4: 'rotate(180deg) rotateY(180deg)',
      5: 'rotate(270deg) rotateY(180deg)',
      6: 'rotate(90deg)',
      7: 'rotate(90deg) rotateY(180deg)',
      8: 'rotate(270deg)',
    }
    const transformation = map[orientation]
    if (transformation !== undefined) {
      return transformation
    } else {
      console.error('Unknown orientation: ' + String(orientation) + '.')
    }
  }

  _readFileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onloadend = () => {
        try {
          resolve(fileReader.result as ArrayBuffer)
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)))
        }
      }
      fileReader.readAsArrayBuffer(file)
    })
  }

  /**
   * @returns A number between 1 and 8, or undefined if not found.
   *          In case of undefined, 1 (no rotation) should be assumed.
   */
  _getOrientationValueFromJpegData(dataView: DataView): number | undefined {
    const exifStartUInt16 = 0xffe1
    const orientationTagUInt16 = 0x0112
    const intelFormatLittleEndianIndicator = 0x4949 /* ...and the motorola format is 0x4D4D */

    const exifStartIndex = this._findUInt16InDataView(dataView, exifStartUInt16, { start: 2 })
    if (exifStartIndex !== undefined) {
      const isLittleEndian = dataView.getUint16(exifStartIndex + 10) === intelFormatLittleEndianIndicator
      const exifEndIndex = exifStartIndex + 2 + dataView.getUint16(exifStartIndex + 2, isLittleEndian)

      const orientationTagIndex = this._findUInt16InDataView(dataView, orientationTagUInt16, {
        start: exifStartIndex + 12,
        end: exifEndIndex,
        isLittleEndian,
      })
      if (orientationTagIndex !== undefined) {
        return dataView.getUint16(orientationTagIndex + 8, isLittleEndian)
      }
    }
    return undefined
  }

  _isJpegFile(data: ArrayBuffer, dataView: DataView): boolean {
    return data.byteLength >= 2 && dataView.getUint16(0) === 0xffd8
  }

  /**
   * @param search Two bytes. E.g. 0xFFE1
   * @returns The byteIndex of "search" in the data, or undefined if not found.
   */
  _findUInt16InDataView(
    dataView: DataView,
    search: number,
    {
      start = 0,
      end = dataView.byteLength,
      isLittleEndian = false,
    }: { start?: number; end?: number; isLittleEndian?: boolean } = {},
  ): number | undefined {
    let index = start
    while (index < end - 2) {
      if (dataView.getUint16(index, isLittleEndian) === search) {
        return index
      }
      index += 2
    }
    return undefined
  }
}
