/**
 * @typedef {Object} PhotatoMessage
 * @property {string} title Not used publicly, it's just to recognize the message.
 * @property {int} courseDayIndex The index of the day the message should be sent. Can be negative. 0 is the first Sunday.
 * @property {string} channel One of the `channels` constants
 * @property {string} audience One of the `emailAudiences` or `facebookAudiences` constants
 * @property {string} locale E.g. "en-US".
 * @property {string|undefined} subject Only for emails.
 * @property {string} contentType  One of the `contentTypes` constants
 * @property {string} content "text/plain" or "text/html".
 */

// \n → keep in Facebook messages
// {courseStartDate} (a nicely formatted date)
// {signedUpCount} → 27 (just a number)
// {signUpUrl} → https://bit.ly/2tB1hpR (plain text)
// {facebookGroupUrl} → bit.ly link (plain text)
// {courseTitle} → e.g. "2020. őszi Photato tanfolyam"
// https://... → keep as plain text in Facebook posts; replace with <a> tag in emails
// {firstName} → Student's first name

const emailAudiences = {
    graduatedStudents: 'graduatedStudents',
    currentStudents: 'currentStudents',
    mentors: 'mentors',
    winners: 'winners',
};
const facebookAudiences = {
    page: 'page',
    group: 'group',
    previousGroup: 'previousGroup',
};
const channels = {
    email: 'email',
    facebook: 'facebook',
};


// noinspection HtmlUnknownTarget
const photatoMessages = [
    {
        title: '“Coming soon” – course starts in 13 days',
        courseDayIndex: -13,
        channel: channels.facebook,
        audience: facebookAudiences.page,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Hamarosan indul a következő ingyenes Photato tanfolyam! 📷
Ahogy addig is, 12 hét, 12 heti feladat, sok hasznos elméleti és gyakorlati fotós tudás. Ha van egy fényképeződ vagy mobilod, és szeretnél menőbb képeket csinálni, iratkozz be!
Már csak 2 hét: 13 nap múlva ({courseStartDate}) kezdünk.
A legjobb képek készítői értékes nyereményeket kapnak a végén! 🥔
Ha már részt vettél tanfolyamon, de nem csináltad végig, bátran iratkozz be újra, sosem késő!
Ha már ismered a Photatot és tudod, milyen király, ajánld a barátaidak. A tanfolyam ingyenes, reklámra nem tudunk költeni, ezért a te megosztásodra számítunk. ❤️`,
    },
    {
        title: 'Course starts in 10 days',
        courseDayIndex: -10,
        channel: channels.facebook,
        audience: facebookAudiences.page,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Már csak 10 nap, és jön az első heti feladat!

A most induló csoport népszerűbb lett, mint gondoltuk: ma reggel már {signedUpCount} feliratkozót számoltunk!

Ha szeretnél csatlakozni, de még nem töltötted ki a formot, tedd meg itt: {signUpUrl}

Ha szeretnéd a barátaidat is meghívni, még nem késő nekik is csatlakozniuk. Egyébként együtt fotózni menni jó buli és/vagy remek randi tud lenni. :)

Kattints a Megosztás gombra az oldal tetején, hogy megoszd a Photato oldalt a saját faladon vagy Messengeren.`,
    },
    {
        title: 'Course starts in 5 days',
        courseDayIndex: -5,
        channel: channels.facebook,
        audience: facebookAudiences.page,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Már csak 5 nap, és indul a következő ingyenes kurzus! Izgalmas 12 hét elé nézünk, és egyelőre úgy néz ki, legalább {signedUpCount} fővel indulunk. 😌Csatlakozz, és küldd tovább a barátaidnak, akik szeretnének fotózni!

Lehetsz kezdő vagy haladó, jöhetsz mobillal vagy fényképezőgéppel, inspiráló feladatokkal és hozzájuk kapcsolódó hasznos tudásanyaggal várunk!

Ha csatlakoznál, töltsd ki a jelentkezésed itt: {signUpUrl}, majd lépj be a kurzus Facebook csoportjába is, ahol hetente frissen feltöltjük a képeket, és igazi kis fotós közösséget alkotunk! Ezt pedig itt találod: {facebookGroupUrl} 

Ha szeretnéd a barátaidat is meghívni, kattints a Megosztás gombra az oldal tetején. Az a tapasztalat, hogy akik együtt tanulnak, messzebbre jutnak. 😊`,
    },
    {
        title: 'Welcome to the group',
        courseDayIndex: -5,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Sziasztok, üdv a {courseTitle} csapatában!

Ez a csoport azért jött létre, hogy
hetente tudjátok követni egymás fotóit,
kérdezzetek, beszélgessetek, szakmázzatok, mókázzatok,
szervezzünk közös fotózásokat,
illetve mi is elérjünk Titeket az emaieken túl :)

Izgalmas 12 hét elé nézünk, reméljük Ti is nagyon várjátok! Ha még nem töltöttétek ki a jelentkezési formot, tegyétek meg itt: {signUpUrl}

Visszaszámlálás indul!`,
    },
    {
        title: 'Old Facebook team closing',
        courseDayIndex: -4,
        channel: channels.facebook,
        audience: facebookAudiences.previousGroup,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Sziasztok!
Sokan jelentkeztetek ebbe a csoportba, ám szeretnénk erre az évre egy újat indítani, ami már el is készült itt találjátok: {facebookGroupUrl}
Szeretnénk kérni, hogy jelentkezzetek be oda is, mivel ott történik majd az izgalom! 😎 Várunk szeretettel!`,
    },
    {
        title: 'Course starts in 3 days',
        courseDayIndex: -3,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '3 nap és jön az első feladat!',
        contentType: 'text/html',
        content: `<p>Kedves {firstName}!</p>

<p>Nagyon örülünk, hogy feliratkoztál a téli fotótanfolyamra!</p>

<p>Már csak 3 nap, és kezdünk, úgyhogy töltsd fel a fényképezőgéped,<br />
tisztítsd ki a kinti cipőd, és szabadíts fel legalább 20 percet a jövő hétre.</p>

<p>Ha még nem tetted, lépj be a kurzus Facebook csoportjába is,<br />
ahol hetente frissen feltöltjük a képeket, és igazi kis fotós közösséget alkotunk!<br />
Pontosan itt találod: <a href="{facebookGroupUrl}">{facebookGroupUrl}</a></p>

<p>Emellett még nem késő meghívni a barátaidat – együtt funkybb a tanulás!</p>
<p>Itt van például egy rövid üzenet, amit már küldhetsz is annak, akivel szívesen tanulnál:</p>
<p>==================<br/>
Helló! Képzeld, beiratkoztam egy elég királynak ígérkező, ingyenes fotós tanfolyamra, ami 3 nap múlva indul!<br />
Tanuljunk együtt, jelentkezz gyorsan itt: <a href="{signUpUrl}">{signUpUrl}</a><br/>
==================</p>

<p>Üdv,</p>
<p>-- <br />a Photato csapata</p>`,
    },
    {
        title: 'Course starts in 2 days',
        courseDayIndex: -2,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Még 2 nap, és kezdünk! Készülődtök már?✌️

Fontos: ha szeretnéd megkapni a feladatokat, nem elég a Facebook oldalt és/vagy csoportot lájkolni, töltsd ki a jelentkező lapot is: {signUpUrl} (6 kérdés, 1 perc)

Még nem késő meghívni a barátaidat, ha szívesen tanulnál/gyakorolnál velük együtt. 😎

Itt van pl. egy rövid üzenet, amit küldhetsz nekik:
“Helló! Képzeld, beiratkoztam egy elég királynak ígérkező, ingyenes fotós tanfolyamra, ami 3 nap múlva indul! Ha van kedved neked is jönni, jelentkezz gyorsan itt: {signUpUrl}”`,
    },
    {
        title: 'Welcome mentors',
        courseDayIndex: -2,
        channel: channels.email,
        audience: emailAudiences.mentors,
        locale: 'hu-HU',
        subject: 'Mentorkodás',
        contentType: 'text/html',
        content: `<p>Sziasztok!</p>
<p>Ti jelentkeztetek mentornak a következő Photato kurzusra.</p>
<p>Először is nagyon köszi a segítséget előre is! :) A képekkel kapcsolatos visszajelzés volt a leggyakrabban kért változtatás az előző kurzuson, így azt hiszem, azzal, hogy segítesz, nagyon nagy értéket kapnak majd az új tanulók.</p>
<p>6 mód, ahogyan segíteni tudsz:</p>
<ol>
<li><strong>Iratkozz fel a tanfolyamra.</strong> Az emailek hasonlóak lesznek az előzőekhez, de javítunk rajtuk (pl. a sportosat egészen átalakítjuk), szóval hasznos, ha megkapod az új leveleket. Itt a <a href="{signUpUrl}">feliratkozós form</a>.</li>
<li><strong>Aktívkodj a Facebook csoportban.</strong> <a href="{facebookGroupUrl}">Csatlakozz</a>, ha még nem vagy benn. Az előző kurzushoz még nem volt csoport; most azt várjuk, hogy akik nem értenek valamit, kérdeznek majd, esetleg beküldik a képeiket véleményezésre még a beküldés előtt. Ha tudsz, válaszolj a kérdéseikre, ill. ha te is csinálod az adott heti feladatot, postolj kérdéseket/képeket/bármit bátran.</li>
<li><strong>Kommentelj a galériákhoz.</strong> A visszajelzések alapján  a legtöbb tanulónak rengeteget adna, ha kiemelnénk, hogy mi tetszik a képeiben, esetleg mit csináltunk volna másképp rajtuk. Ha egy maréknyi ember kommentel, azt várom, hogy a tanulók is jobban be mernek majd szállni a beszélgetésbe. (Erről még írok részleteket bő 1 hét múlva, amikor kijön az első galéria.)</li>
<li><strong>Szavazz a képekre.</strong> A lájk-alapú rangsorolással sokan nem voltak elégedettek, ezért megpróbáljuk azt, hogy most a lájkok és a mentorok szavazati együtt fogják eldönteni, melyik képek nyerik a heteket. Így kapsz majd egy táblázatot, amiben szavazhatsz a kedvenceidre, így a te szavazataid nagyobb súllyal fognak nyomni a latba.</li>
<li><strong>Gyere el a közös eseményre.</strong> Az <strong>5. vagy 7. héten</strong> (sportfotós vagy hosszú záridős hét) valamelyik hétköznap este tartunk egy kb. 2 órás közös fotózást azokkal, akik eljönnek, hogy átsegítsük a nehézségeken azokat, akik megijednek a hirtelen sok elmélettől, vagy a viszonylag nehéz feladattól.</li>
<li><strong>Jelezz vissza.</strong> Bátran oszd meg az ötleteidet, javaslataidat. Kérlek, mindenképp küldj egy rövid válaszlevelet, hogy vetted az infókat.</li>
</ol>
<p>Ha azóta úgy alakult, hogy mégsem fér bele az idődbe a mentorkodás, vagy másra gondoltál, nyugodtan írj, és leveszünk a listáról :)</p>
<p>Szép estét,</p>
<p>Dávid</p>`,
    },
    {
        title: 'Course starts in 1 day',
        courseDayIndex: -1,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: 'Nulladik nap: felkészülés',
        contentType: 'text/html',
        content: `<p>Kedves *|FNAME|*!</p>
<p>Köszönjük, hogy feliratkoztál ingyenes krumplifotós tanfolyamunkra.</p>
<p>Valójában nem csak krumplikat fogunk fotózni – remélem, megérted, hogy ez csak Neked lenne izgalmas, sok más ember unalmasnak találná. 😀</p>
<p>Eddig {signedUpCount} feliratkozót számláltunk, ennek kb. ⅔-a fényképezőgéppel jön, ⅓-a mobillal. Ez alapján picit jobban a kamerásokra fogunk koncentrálni, de figyelünk rá, hogy mobillal is érdekes legyen a kurzus.</p>
<p>Filmes géppel maximum 1–2 ember szokott jönni, így szinte kizárólag digitális eszközökről fogunk beszélni – de egyébként a legtöbb tanult dolog használható lesz analóg gépekhez is.</p>
<p>Amivel tudtok készülni, amíg megjön holnap az első feladat:</p>
<p><strong>Ha fényképezőgéppel fotózol:</strong></p>
<ul>
<li>Nézd meg, hogy a géped fel van-e töltve, és van-e benne memóriakártya. Ha esetleg tele van a kártya, mentsd le a képeket a számítógépedre.</li>
<li>Találd meg, hogyan tudod a géped “auto” üzemmódból “P”, “A”, “S” és “M” módba kapcsolni. (Ha nem tudod, mik ezek, nem baj, csak keresd meg.)</li>
<li>Találd meg, hogyan tudod beállítani az ISO értéket. (Ha nincs meg, az se baj, lesz még időd megkeresni.)</li>
<li>Ha van kedved, keresd meg és lapozd át a géped használati utasítását – ez segíthet a fentiekben is.</li>
</ul>
<p><strong>Ha mobillal fotózol</strong>, de szeretnéd kipróbálni a fényképezőgépeken elérhető beállításokat:</p>
<ul>
<li>Ha Androidod van, ajánljuk a Camera FV-5 alkalmazást, amivel sokkal több dolgot be tudsz állítani, mint a legtöbb telefon alap kamera alkalmazásával.<br />Ennek van egy <a href="https://play.google.com/store/apps/details?id=com.flavionet.android.camera.lite">ingyenes Lite </a>és egy 899 Ft-ba kerülő <a href="https://play.google.com/store/apps/details?id=com.flavionet.android.camera.pro">Pro változata</a>. Ezekben pontosan ugyanazok a funkciók elérhetőek, de a Lite csak alacsony felbontású (2 megapixeles) képeket készít.<br />Így ki tudod próbálni ingyen, és ha tetszik, megveheted a Pro változatot.</li>
<li>Ha iPhone-od van, a <a href="https://apps.apple.com/us/app/procam-7/id730712409">ProCam 7</a>-et ajánljuk (2 290 Ft), ebben szintén minden olyan beállítást megtalálsz, amit egy fényképezőgépen is.</li>
</ul>
<p>De persze az alap kamera alkalmazással is remek fényképeket lehet készíteni, szóval ha nincs kedved ezeket letölteni, az sem baj.</p>
<p>Jó készülődést, holnap jön az első feladat. 😊</p>
<p>Üdv,</p>
<p>-- <br>
a Photato csapata</p>
`,
    },
    {
        title: 'Course starts in 1 day',
        courseDayIndex: -1,
        channel: channels.facebook,
        audience: facebookAudiences.page,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Holnap indul a {courseTitle}, már legalább {signedUpCount} diákkal indulunk, és még nem késő csatlakozni! 😊
Ha Te is szeretnél 12 héten át okosodni fotózás témában, és egy inspiráló közösség tagjává válni, töltsd ki hamar a jelentkezési formot itt, és holnap érkezik is az első lecke a postafiókodba: {signUpUrl}
A tanfolyamhoz tartozó Facebook csoporthoz pedig itt tudsz csatlakozni: {facebookGroupUrl}
Fotózásra fel! 📸
`,
    },
    {
        title: '1st challenge: Food photos',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Első heti feladat: gasztrofotó',
        contentType: 'text/html',
        content: ``,
    },
    {
        title: '1st challenge: Food photos',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '1st challenge reminder',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '2nd challenge: Buildings',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '',
        contentType: 'text/html',
        content: ``,
    },
    {
        title: '2nd challenge: Buildings',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: 'Instructions for mentors',
        courseDayIndex: -2,
        channel: channels.email,
        audience: emailAudiences.mentors,
        locale: 'hu-HU',
        subject: 'Mentorkodás',
        contentType: 'text/html',
        content: ``,
    },
    {
        title: '1st challenge voting',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: 'Facebook group reminder',
        courseDayIndex: -2,
        channel: channels.email,
        audience: emailAudiences.mentors,
        locale: 'hu-HU',
        subject: '[Photato] Megérkeztek az első fotók a Facebook csoportba!',
        contentType: 'text/html',
        content: ``,
    },
    {
        title: '2nd challenge reminder',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '3rd challenge: Macro',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '',
        contentType: 'text/html',
        content: ``,
    },
    {
        title: '3rd challenge: Macro',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '2nd challenge voting',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '3rd challenge reminder',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '4th challenge: Street photography',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '',
        contentType: 'text/html',
        content: ``,
    },
    {
        title: '4th challenge: Street photography',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '3rd challenge voting',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '4th challenge reminder',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: 'Live photo event (summer)',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '5th challenge: Sports photos / Fast objects',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '',
        contentType: 'text/html',
        content: ``,
    },
    {
        title: '5th challenge: Sports photos / Fast objects',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '4th challenge voting',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '5th challenge reminder',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '6th challenge: Animals, plants',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '',
        contentType: 'text/html',
        content: ``,
    },
    {
        title: '6th challenge: Animals, plants',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: 'Live photo event (winter)',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '5th challenge voting',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '6th challenge reminder',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '7th challenge: Long exposure',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '',
        contentType: 'text/html',
        content: ``,
    },
    {
        title: '7th challenge: Long exposure',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: 'Mid-time survey',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] 3 perces kérdőív',
        contentType: 'text/html',
        content: ``,
    },
    {
        title: '6th challenge voting',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '7th challenge reminder',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '8th challenge: Still life',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '',
        contentType: 'text/html',
        content: ``,
    },
    {
        title: '8th challenge: Still life',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '7th challenge voting',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '8th challenge reminder',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '9th challenge: Portrait',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '',
        contentType: 'text/html',
        content: ``,
    },
    {
        title: '9th challenge: Portrait',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '8th challenge voting',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '9th challenge reminder',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '10th challenge: Events',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '',
        contentType: 'text/html',
        content: ``,
    },
    {
        title: '10th challenge: Events',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '9th challenge voting',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '10th challenge reminder',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '11th challenge: Self portrait',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '',
        contentType: 'text/html',
        content: ``,
    },
    {
        title: '11th challenge: Self portrait',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '10th challenge voting',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '11th challenge reminder',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '12th challenge: Freestyle',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '',
        contentType: 'text/html',
        content: ``,
    },
    {
        title: '12th challenge: Freestyle',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '11th challenge voting',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '12th challenge reminder',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: 'Exhibition (Facebook event)',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: '12th challenge voting',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: 'Event reminder',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: ``,
    },
    {
        title: 'Exhibition for winners',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.winners,
        locale: 'hu-HU',
        subject: '[Photato] Eredményhirdetés',
        contentType: 'text/html',
        content: ``,
    },
    {
        title: 'Farewell',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.winners,
        locale: 'hu-HU',
        subject: '[Photato] Viszlát, és köszi a fotókat',
        contentType: 'text/html',
        content: ``,
    },
];

module.exports = {
    emailAudiences,
    facebookAudiences,
    channels,
    photatoMessages,
}