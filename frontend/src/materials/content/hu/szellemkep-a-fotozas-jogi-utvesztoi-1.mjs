import React from '../../../web_modules/react.js';
import {NavLink} from '../../../web_modules/react-router-dom.js';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'szellemkep-a-fotozas-jogi-utvesztoi-1',
        title: 'A fotózás jogi útvesztői, I. rész: Jogvédelem a fotózás körében',
        author: 'Nagy Gergő',
        publishDate: new Date('2017-01-01'),
        publisherName: 'Szellemkep.hu',
        originalUrl: 'https://www.szellemkeponline.hu/foto/a-fotozas-jogi-utvesztoi-i-resz-jogvedelem-a-fotozas-koreben/',
        isOriginalUrlBroken: true,
    };
}

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {React.ReactElement}
 */
export default function Article() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return <>
        <p>A fotós, amikor embert fényképez, a legtöbb esetben nem azért készíti el és hozza nyilvánosságra felvételét, hogy azzal az érintett személy magánszférájába behatoljon, és számára kellemetlen helyzetben ábrázolja. Ideális esetben sokkal inkább arról van szó, hogy egy téma, élethelyzet, vagy éppen az adott emberi sors lenyomatát kívánja a közönségnek átadni. A jogi szabályozás ugyanakkor más szempontokat kíván érvényre juttatni: a képmáshoz való jog védelme körében az emberi autonómia, háborítatlanság, végső soron az emberi méltóság megóvását tűzi ki célul. Most induló cikksorozatunkkal arra vállalkozunk, hogy bemutassuk: a két nézőpont nem áll kibékíthetetlenül ellentétben egymással. Ehhez igyekszünk közelebb hozni a jog nyelvét a mindennapokhoz úgy, hogy a fotózásra vonatkozó – elsőre nagyon szigorúnak tűnő – jogszabályokat lefordítjuk a „mindennapos fényképezés” eseteire, hogy a vonatkozó részeket jobban megismerhessük. Elsőként a szabályozás logikáját, és az engedélyköteles felvételek kérdését járjuk körül.</p>

        <h2>Csak látszólagos szigorodás</h2>
        <p>A jogi szabályozás és a bíróságok gyakorlata a fotózás szabadságának már eddig is kereteket szabott, és sokan arról beszélnek, hogy a törvény is szigorodott az utóbbi időben. Ami biztos, hogy idén tavasszal hatályba lépett az új Polgári Törvénykönyv, amely sok más jogterülethez hasonlóan a képmáshoz fűződő személyiségi jogok körében is változtatott a korábbi törvényi szabályozáson. Ennek lényege, hogy a korábbiakkal ellentétben már nemcsak a fényképfelvétel nyilvánosságra hozatalához, hanem – két kivétellel – pusztán elkészítéséhez is az érintett személy hozzájárulása szükséges.</p>
        <blockquote>
            <p>
                <strong>2:48. §</strong><em>[A képmáshoz és a hangfelvételhez való jog]</em><br/>
                (1) Képmás vagy hangfelvétel elkészítéséhez és felhasználásához az érintett személy hozzájárulása szükséges.<br/>
                (2) Nincs szükség az érintett hozzájárulására a felvétel elkészítéséhez és az elkészített felvétel felhasználásához tömegfelvétel és nyilvános közéleti szereplésről készült felvétel esetén.
            </p>
        </blockquote>
        <p>Egy valamit azonban rögtön le kell szögeznünk: az új Polgári Törvénykönyv tulajdonképpen <strong>nem hozott igazi változást</strong>. A bírósági gyakorlat gyakran már eddig is megállapította a jogsértést pusztán azért, mert a fénykép elkészítése engedély nélkül történt. Az tehát, hogy ezt most már a törvény kifejezetten előírja, valójában a bírói gyakorlat törvénybe foglalását jelenti, de nem igazi szigorodás. Hanem inkább azt mondhatjuk: <strong>a szabályozás eddig is szigorú volt és az is maradt</strong>. Legalábbis ami a törvény írott betűjét illeti.
        </p>

        <h2>De miért?</h2>
        <p>A fotós számára nehéz helyzetet teremthet, és az adott pillanatban rejlő megismételhetetlen lehetőséget veszítheti el azzal, ha kattintás előtt engedélyt kér a fotóalanytól. Hogy jobban megértsük, miért is van erre szükség, érdemes kicsit áttekinteni a korlátozásban rejlő <strong>jogvédelmi célokat</strong>.
        </p>
        <p>A képmáshoz való jog a minden embert megillető személyiségi jogok körébe tartozik. A jogalkotó abból indul ki, hogy az emberi személyiséget külső (fizikai) és belső (immateriális) tulajdonságok összessége adja, amelynek egyik elemét az emberi képmás jelenti. A személyiség teljes körű védelmet élvez minden illetéktelen behatással szemben, ami a magánszférát sértheti. Adott esetben pedig erre egy fényképfelvétel is alkalmas lehet.</p>
        <p>A probléma az, hogy a jogszabály nem tud minden egyes helyzetre előre, külön reagálni, ezért nem tudja figyelembe venni, hogy a fotóművész jó esetben nem bántó szándékkal közeledik témájához és az alanyhoz. Nincs ugyanis semmiféle garancia arra, hogy nem jön egy olyan fotós sem, aki visszaél felvételével, és esetleg arra használja fel – akár szándékosan, akár nem –, hogy az illető magánszférájába engedély nélkül behatolva őt megsértse. A törvény ilyen helyzetben mindössze annyit tehet, hogy erre a veszélyre figyelemmel <strong>kijelöli a fotózás határait</strong>, mégpedig a fényképezett személy védelmének szem előtt tartásával. A jogalkotói cél így nem a <em>fotós korlátlan szabadságának biztosítása</em> (hiszen nincs ráhatása arra, hogy ki mire használja fel ezt a szabadságot), hanem a <em>fotóalany védelmének biztosítása</em> a visszaélésszerű cselekményekkel szemben (amely viszont törvényszövegben garantálható azáltal, hogy ezen cselekményeket szankcionálni rendeli).
        </p>
        <p>A törvény azért foglal állást úgy, hogy az érintett személy hozzájárulásával elkészíthető és felhasználható (közzétehető) a fénykép, mert vélelmezi, hogy ha ezekre engedélyt kaptunk, akkor az illető tulajdonképpen beleegyezését adta abba, hogy képmásán keresztül a magánszféráját is megismerheti a külvilág, vagy másképpen fogalmazva: lemondott az őt megillető védelemről.</p>

        <h2>Tényleg mindig engedélyt kell kérni?</h2>
        <p>Mindez persze csak elméleti alapvetés, a szabályozás logikája. Sokkal érdekesebb, hogyan is működik a gyakorlatban, és mire kell figyelni fotósként.</p>
        <p>Emberi képmásról készült felvételről abban az esetben beszélhetünk, ha az alapján <strong>beazonosítható</strong> az illető, akiről a kép készült. Ez technikailag azt jelenti, hogy a fotó kellően éles, fókuszált, az adott személy <strong>felismerhető</strong> rajta. Nem annak van tehát elsődleges jelentősége, hogy például szemből vagy profilból ábrázoljuk az illetőt, hanem hogy alkalmas-e a kép arra, hogy őt mint egyént bárki felismerhesse, azonosíthassa. Ez természetesen akkor is megvalósulhat, ha nemcsak ő, hanem többen is szerepelnek a fotón, de a fotó lényegét valamely személy <strong>egyéni ábrázolása</strong> adja. Csak az ilyen képek lehet ugyanis alkalmasak arra, hogy a magánszférát érintsék. Ha a törvényt vesszük alapul, akkor elvileg minden ilyen felvételhez engedélyt kell kérnünk, és ha ezt elmulasztjuk, jogsértést követünk el.
        </p>
        <p>Persze felmerül a kérdés: hogyan kapom meg az engedélyt? Nos, nem feltétlenül úgy kell ezt elképzelni, hogy mindenféle papírt iratunk alá. Persze ez sem kizárt, de a hozzájárulást <strong>ráutaló magatartással</strong> is meg lehet adni. Ennek legtipikusabb esete, mikor az illető pózol nekünk, vagy ha bár látja, hogy fénykép készül róla, látszólag nincs kifogása ez ellen, tudomásul veszi. A hozzájárulásnak viszont minden esetben határozottnak és egyértelműnek kell lennie.
        </p>
        <p>Nagyon kell figyelnünk arra is, hogy a fotózásra adott engedély önmagában még nem jelenti azt, hogy a fénykép felhasználható, nyilvánosságra hozható. Az engedély nem értelmezhető kiterjesztő módon. A pózolás vagy ha az illető hagyja magát fényképezni, ugyanis önmagában csak arra jelent felhatalmazást, hogy elkészítsük a képet, de arra nem, hogy fel is használjuk, nyilvánosságra hozzuk. Ehhez külön engedély szükséges, kivéve abban az esetben, ha a felvételkészítés céljáról, és a későbbi felhasználásról már előzetesen tudott az érintett személy. És amire talán nem is gondolnánk: a nyilvánosságra hozatalhoz szükséges engedélyt célszerű nemcsak egy adott projektre vonatkozóan, hanem minden lehetséges későbbi publikáláshoz is kérni, ugyanis a bírói gyakorlat szerint a korábban adott hozzájárulás alapján felhasznált fénykép későbbi, más célból történő, ám engedély nélküli felhasználása is jogsértés.</p>
        <p>
            <em>(<NavLink to="/external-article/szellemkep-a-fotozas-jogi-utvesztoi-2">Következő írásunkban</NavLink> az engedély nélküli fotózás szankcióit mutatjuk be, és megpróbálunk tanácsot adni a helyes eljárásra is.)</em>
        </p>
    </>;
}