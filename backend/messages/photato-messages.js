/**
 * @typedef {Object} PhotatoMessage
 * @property {string} slug Unique identifier of the message
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
// {firstName} → Student's first name
// {courseTitle} → e.g. "2020 summer Photato course"
// {courseStartDate} (a nicely formatted date)
// {facebookGroupUrl} → bit.ly link (plain text)
// {signedUpCount} → 27 (just a number)
// {uploadUrl} → https://photato.eu/upload
// {signUpUrl} → https://bit.ly/3iDJ3HV (plain text)
// {midTimeSurveyUrl} → The URL
// {finalSurveyUrl} → The URL
// {weekXXDeadlineDate} → The formatted date (including day of week) when the XXth challenge is due.
// {liveEventDate} → The formatted date (including day of week) when the mid-course live event happens
// {exhibitionDate} → The formatted date (including day of week) when the final exhibition event happens
// {ownArticleBaseUrl} → An URL to the place where all articles are, without locale. Without a trailing slash.

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

// noinspection HtmlUnknownTarget,PointlessArithmeticExpressionJS,SpellCheckingInspection
const photatoMessages = [
    {
        slug: 'coming-soon-facebook-page-message',
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
        slug: 'minus-10-days-facebook-page-message',
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
        slug: 'minus-5-days-facebook-page-message',
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
        slug: 'welcome-facebook-group-message',
        title: 'Welcome to the group',
        courseDayIndex: -5,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Sziasztok, üdv a {courseTitle} csapatában, ami hamarosan ({courseStartDate}) indul!

Ez a csoport azért jött létre, hogy
- hetente tudjátok követni egymás fotóit,
- kérdezzetek, beszélgessetek, szakmázzatok, mókázzatok,
- szervezzünk közös fotózásokat,
- illetve mi is elérjünk Titeket az emaieken túl 📷

Izgalmas 12 hét elé nézünk, reméljük ti is nagyon várjátok!
Jelentkezni a friss és ropogós honlapunkon keresztül tudtok, amit csekkoljatok itt:
https://photato.eu/

A kurzussal kapcsolatos általános infókért böngésszétek át a GYIK oldalunkat: https://photato.eu/faq, és ha ezután is van kérdésetek, írjatok nekünk üzenetet itt FB-on, vagy a photatophotato@gmail.com-on.

Egyetlen kérésünk lenne: legyetek kedvesek egymással! 🥰

Visszaszámlálás indul! 🤩`,
    },
    {
        slug: 'old-group-closing-facebook-previous-group-message',
        title: 'Old Facebook team closing',
        courseDayIndex: -4,
        channel: channels.facebook,
        audience: facebookAudiences.previousGroup,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Sziasztok!
Hamarosan elindítjuk a következő Photato kurzust! Az új csoport már el is készült. Ha lenne kedved ismételni, itt találod: {facebookGroupUrl}
Ezt a csoportot lezárjuk és privátra állítjuk. A régebbi tartalmakat továbbra is eléred, de az izgalom az új csopotban történik majd. 😎
Ha esetleg olyan jó arc vagy, hogy jönnél mentornak visszajelzésekkel segítseni az újakat, dobj egy e-mailt a photatophotato@gmail.com címre “Mentornak jelentkezem” tárggyal.
Várunk szeretettel!`,
    },
    {
        slug: 'minus-3-days-email-current-students-message',
        title: 'Course starts in 3 days',
        courseDayIndex: -3,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] 3 nap és jön az első feladat!',
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
        slug: 'minus-2-days-facebook-group-message',
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
        slug: 'welcome-email-mentors-message',
        title: 'Welcome mentors',
        courseDayIndex: -2,
        channel: channels.email,
        audience: emailAudiences.mentors,
        locale: 'hu-HU',
        subject: '[Photato] Mentorkodás',
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
        slug: 'minus-1-day-email-current-students-message',
        title: 'Course starts in 1 day',
        courseDayIndex: -1,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Nulladik nap: felkészülés',
        contentType: 'text/html',
        content: `<p>Kedves {firstName}!</p>
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
<p>-- <br />
a Photato csapata</p>`,
    },
    {
        slug: 'minus-1-day-facebook-page-message',
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
        slug: '1st-challenge-email-current-students-message',
        title: '1st challenge: Food photos',
        courseDayIndex: ((1 - 1) * 7) + 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Első heti feladat: gasztrofotó',
        contentType: 'text/html',
        content: `<p>Kedves {firstName}!</p>

<p><img src="https://photato.eu/challenges/illustrations/pizza.jpg" alt="Pizza" style="width:100%; max-width:800px;" /></p>

<p>Az első héten <strong>ételeket</strong> fogunk fotózni!</p>

<p>Az ételek fotózását – más néven “gasztrofotózást” – tökéletes első témának tartjuk, mert kevés lelkesítőbb fotós kihívást ismerünk, mint finom, színes kajákat fényképezni 😋, és mert a legtöbben még bőven tanulhatunk arról, hogy hogyan lehet ezt igazán profin csinálni.</p>

<p><strong>Az első heti feladatod</strong> tehát ételeket/italokat fotózni, kiválasztani közülük a legjobbat, és {week1DeadlineDate} 23:59-ig feltölteni <a href="{uploadUrl}">ezen a linken</a>.</p>

<p>Készültünk neked <a href="{ownArticleBaseUrl}/week1-foodie-shots">jópár tippel, ötlettel</a> ehhez a témához, ezeket mindenképp <strong><a href="{ownArticleBaseUrl}/week1-foodie-shots">olvasd el</a></strong>!</p>

<p><a href="{uploadUrl}">Várjuk a képeket itt</a>! A legjobb beküldött képek díjazásban részesülnek.</p>

<p>Üdv,</p>

<p>-- <br />
a Photato csapata</p>`,
    },
    {
        slug: '1st-challenge-facebook-group-message',
        title: '1st challenge: Food photos',
        courseDayIndex: ((1 - 1) * 7) + 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Az első heti feladat: gasztrofotók! Részletek az emailben.

Ha Gmailt használsz, feliratkoztál, és de nem találod a levelet, nézd meg az Updates, Promotions és Spam mappákban is. (Tipp: Ha kézzel átmozgatod a levelet a bejövő levelek közé, akkor a leveleződ előbb-utóbb megtanulja, hogy oda kell tenni.)
Ha nem látod benne a képet, engedélyezd a képek megjelenítését a photatophotato@gmail.com címről érkezett levelekben – a levél tetején kérdezi a Gmail.`,
    },
    {
        slug: '1st-challenge-reminder-facebook-group-message',
        title: '1st challenge reminder',
        courseDayIndex: ((1 - 1) * 7) + 6,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Beérkezett már pár kép, még 2 napod van hozzátenni a tiédet: {uploadUrl}

Ha túl sok a jó fotód és nem tudsz választani, kérj segítséget itt a csoportban, vagy csak dobj fel egy pénzt: jobb véletlenül a második legjobb képed beküldeni, mint ha lemaradsz. 😊

A beküldött képek közül közönségszavazással és a mentorok szavazatai alapján választjuk majd ki a legjobbakat, amelyeket értékes krumplikkal fogunk díjazni. 
 🥔🥔🥔`,
    },
    {
        slug: '2nd-challenge-email-current-students-message',
        title: '2nd challenge: Buildings',
        courseDayIndex: ((2 - 1) * 7) + 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Második hét: épületek',
        contentType: 'text/html',
        content: `<p>Kedves {firstName}!</p>

<p><img src="https://photato.eu/challenges/illustrations/taj-mahal.jpg" alt="Taj Mahal" style="width:100%; max-width:800px;" /></p>

<p>A második hét témája az <strong>épületfotózás</strong>!</p>
<p>Közben gyorsan megtanuljuk, mi a zoom, a blende és a záridő.</p>
<p>A legjobb képedet holnaptól, <a href="{uploadUrl}">itt tudod majd feltölteni</a>.</p>

<p>Az e heti feladat épületek, nevezetességek, terek fotózása lesz. A legjobb képedet {week2DeadlineDate} 23:59-ig, <a href="{uploadUrl}">itt tudod feltölteni</a>.</p>
<p>A múlt héthez hasonlóan most is megpróbáltuk összeszedni nektek a legjobb tippjeinket, ötleteinket az épületfotózáshoz, ezeket <strong><a href="{ownArticleBaseUrl}/week2-building-photography">itt olvashatod</a></strong>.</p>

<p>Ha esetleg még nem küldted be a múlt heti (gasztrofotó) képedet, ma éjfélig még azt is <a href="{uploadUrl}">megteheted</a>. 🕚</p>

<p>Jó fotózást,</p>

<p>-- <br />
a Photato csapata</p>`,
    },
    {
        slug: '2nd-challenge-facebook-group-message',
        title: '2nd challenge: Buildings',
        courseDayIndex: ((2 - 1) * 7) + 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `A második heti feladat: épületfotók!

Ha feliratkoztál, de nem találod az emailt, nézd meg az Updates, Promotions és Spam mappákban is. Tipp: Ha kézzel átmozgatod a levelet a bejövő levelek közé, akkor a leveleződ előbb-utóbb megtanulja, hogy oda kell tenni.

A gasztrofotódat itt töltsd fel ma éjfélig: {uploadUrl}, az épületfotók pedig ugyanide jöhetnek holnaptól.

Ha valamiért nem kaptad volna meg az első heti feladatot, pl. mert később jelentkeztél, írj nekünk, és pótoljuk! 😎`,
    },
    {
        slug: 'instructions-email-mentors-message',
        title: 'Instructions for mentors',
        courseDayIndex: ((1 - 1) * 7) + 8,
        channel: channels.email,
        audience: emailAudiences.mentors,
        locale: 'hu-HU',
        subject: '[Photato] Galéria kommentelés infók',
        contentType: 'text/html',
        content: `<p>Szia!</p>
<p>Az imént elkészült és feltöltődött az első hét galériája. A visszajelzések alapján rengeteget dobna a tanulók élményén, ha kapnának véleményeket a képeikre. Mentorként úgy tudsz segíteni, ha végigmész a beérkezett képeken, és lájkolod, amik tetszenek, plusz mindegyik képhez írsz néhány érzést/gondolatot.</p>
<p>Összeszedtem néhány tippet és gondolatot, hogy ha nem csináltál még ilyet, bátorságot és ötleteket meríthess, hogy hogyan tudsz minél többet segíteni. Emellett megfogalmaztam néhány kérést, amivel szerintem egységes, segítőkész képet tudunk mutatni a tanulók felé. Itt vannak:</p>
<ol>
<li><strong>Díjazz bőkezűen:</strong> Személyiségedtől, hangulatodtól függően lájkold a képek 25-75%-át.</li>
<li><strong>Bókolj bőkezűen:</strong> Minden képpel kapcsolatban megfogalmazható valami pozitív. Emeld ki, amit meglátsz benne, ezzel érzelmileg támogatva, bátorítva a beküldőt, hogy tanuljon, fejlődjön tovább.</li>
<li><strong>Véleményezz, ne minősíts:</strong> Két gyors definíció, hogy mire gondolok:<br /><em>Minősítés</em> minden ítélet, ami a szerzőről vagy a képről szól, pl. “jó”, “rossz”, “jól sikerült”, “rosszul sikerült”, “ügyes vagy”, “gyökér vagy”, “gyönyörű”, “undorító”.<br /><em>Vélemény</em> az, ami rólad szól, pl. “tetszik”, “nem tetszik”, “megérintett”, “elgondolkodtatott”, “gyönyörködtem benne”, “nem értettem”.<br />Ez csak egy irányelv, nem szabály. A legtöbb pozitív minősítés (pl. “gyönyörű ez a kép”) valószínűleg nem sért senkit. De pl. az “ez a legjobb kép a héten” már lehet bántó egy másik tanulónak. A negatív minősítés viszont nagyon gyakran bántóan hat, ezért ettől mentorként próbálj tartózkodni.</li>
<li><strong>Emeld ki, ami tetszik:</strong> Hívd fel a figyelmet a kép egyes részeire, objektív tulajdonságaira. Segítő kifejezések pl.: “Nagyon tetszik, hogy…” / “Imádom, hogy…”</li>
<li><strong>Asszociálj:</strong> Segítő kifejezések pl.: “Az jut róla eszembe, hogy…” / “Nekem olyan, mintha…” Ez jó eséllyel azt sugallja a készítőnek, hogy igazán megpróbáltál kapcsolódni a képéhez, és őszintén megosztod vele a gondolataidat.</li>
<li><strong>Mondd el, mit javítanál:</strong> Segítő kifejezések pl.:  “Sajnálom, hogy…” / “Nekem még jobban tetszene, ha…”. Figyelj itt is arra, hogy magadról beszélj és objektív tulajdonságokat emelj ki.<br />Kevéssé sértő pl. a “Nekem még jobban tetszene fehér háttérrel.”,<br />támadóbban hathat, ha róla beszélsz, pl. “Próbáld ki fehér háttérrel!”<br />vagy ha minősítesz: “Fehér háttérrel jobb lenne.”, “Kár, hogy elrontja a képet a háttér.”</li>
<li><strong>Ismerd a tananyagot:</strong> Ha egy kép alapján úgy tűnik, valamit még nem értett meg a beküldő, javasold, hogy nézze át az adott heti levelet újra. Persze nem elvárható, hogy fejből emlékezz, mit hol tanítottunk pontosan. De ha nagyjából megvan, hogy mit tanult már, nem fogsz olyasmire hivatkozni, amit még nem tud. Pl. ha egy túl hideg fényű épületfotót küld be, ne csak annyit mondj, hogy a fehéregyensúllyal van a baj, hanem tedd hozzá, hogy ezt majd később (a 7. héten) megtanuljuk. Vagy ha van rá energiád, linkeld be a fehéregyensúlyról szóló cikket, amit az első heti levélben az érdeklődőknek ajánlottunk.</li>
<li><strong>A saját képeid is érnek:</strong> Ha te is részt veszel a kurzuson, lájkold a saját képedet is nyugodtan, ha elégedett vagy vele. Kommentelj is rá bátran, akár véleményt mint a többiekére, akár zaftos részleteket a készítés hátteréről. 😊</li>
<li><strong>Ne moderálj:</strong> Ha valaki minősítő, akár bántó kommentet küld egy képre, ne oltsd le őt válaszüzenetben. Írd le a saját véleményed, és koncentrálj még jobban az őszinte dícséretre, bátorításra, hogy ellensúlyozd a bántó visszajelzést. Ha nagyon bántó kommentet találsz, az üzenet melletti három pontra kattintva jelentsd a csoport adminnak.</li>
<li><strong>Ne csak adj, kapj is a mentorságból:</strong> Megtalálni a szépséget a képekben; kitalálni, hogy mi volt a fényképész szándéka; tanácsokat adni gyakran nagyon nehéz feladat. És épp ettől egy remek lehetőség ez a tanulásra. A mentorkodás gyakorlatilag egy haladó Photato kurzus. Tedd bele az energiát, és lehet, hogy ebből még többet fogsz tanulni, mint az alap tanfolyamból.</li>
</ol>
<p>Összességében, próbáljunk szerényen, őszinte segítő szándékkal fordulni a tanulók felé, hiszen egyikünk sem pulitzer díjas fotós (még! 😉), és közben persze érezzük jól magunkat és tanuljunk belőle sokat. 😊 És még egyszer nagyon köszi a segítséget!</p>
<p>Kérlek, ha elolvastad ezt a levelet, küldj egy választ, hogy elolvastad, illetve ha kiegészítésed/kérésed/kérdésed van, azt is. Köszi :)</p>
<p>Szép napot,</p>
<p>a többi Photatos</p>`, // TODO: Add a link to the first row once we have it in-code.
    },
    {
        slug: '1st-challenge-voting-facebook-group-message',
        title: '1st challenge voting',
        courseDayIndex: ((1 - 1) * 7) + 8,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `[Galéria címe: "1. hét: gasztrofotók"]
Megérkeztek az első heti beadások!

- Lájkold a kedvenceidet,
- Írj bátran konstruktív véleményt a többiek fotóira. Úgy írj, ahogy te is örülnél, hogy írjanak a saját képeidről! 
- A lájkok sokat segítenek majd eldönteni, hogy melyik fotó nyeri a hetet,
- Ha gondolod, iratkozz fel a saját képedre, hogy megkapd a kommentekről az értesítést, ezt így teheted meg: https://bit.ly/38r3Jy9  - jobb felül a három pöttyre kattintva, értesítések bekapcsolása.

Hajrá! 😊`, // TODO: We'll need a link in this message once we have the galleries in the website.
    },
    {
        slug: 'facebook-group-reminder-email-mentors-message',
        title: 'Facebook group reminder',
        courseDayIndex: ((2 - 1) * 7) + 5,
        channel: channels.email,
        audience: emailAudiences.mentors,
        locale: 'hu-HU',
        subject: '[Photato] Megérkeztek az első fotók a Facebook csoportba!',
        contentType: 'text/html',
        content: `<p>Kedves {firstName}!</p>
<p>Ez egy emlékeztető, hogy ne felejts el csatlakozni a "{courseTitle}" Facebook csoporthoz.</p>
<p>Ez három dolog miatt hasznos neked:</p>
<ol>
<li>ott látod hétről-hétre a többiek beküldött képeit – most pl. a múlt hét gasztrofotóit,</li>
<li>hogy ne terheljük a levelesládád, a csoportba küldjük a kurzushoz kapcsolódó kiegészítő infókat, emlékeztetőket,</li>
<li>ott tudsz beszélgetni a többi résztvevővel és a mentorokkal.</li>
</ol>
<p>Várunk sok szeretettel a csoportban, <a href="{facebookGroupUrl}">csatlakozz itt</a>! 😊</p>
<p>-- <br />a Photato csapata</p>`,
    },
    {
        slug: '2nd-challenge-reminder-facebook-group-message',
        title: '2nd challenge reminder',
        courseDayIndex: ((2 - 1) * 7) + 5,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `A múlt héten rengeteg, több, mint 40 kajafotót kaptunk (hamarosan indítjuk a szavazást a legjobb első heti képért!), és már az épületfotók is érkezgetnek. Még 3 napod van hozzátenni a tiédet is.

Ha túl sok a jó fotód és nem tudsz választani, kérj segítséget, vagy csak dobj fel egy pénzt: jobb véletlenül a második legjobb képed beküldeni, mint ha lemaradsz.

Ide jöhet: {uploadUrl}`, // TODO: "The "more than 40" part would love some dynamic data if we had the pic listing feature
    },
    {
        slug: '3rd-challenge-email-current-students-message',
        title: '3rd challenge: Macro',
        courseDayIndex: ((3 - 1) * 7) + 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Harmadik hét: makró',
        contentType: 'text/html',
        content: `<p>Kedves {firstName}!</p>

<p><img src="https://photato.eu/challenges/illustrations/mosquitoes.jpg" alt="Légyott" style="width:100%; max-width:800px;" /></p>

<p>Ezen a héten <strong><a href="{ownArticleBaseUrl}/week3-close-up-photography">megtanuljuk, mi az a makrózás</a></strong>, és hogyan érdemes 5 centiről krumplit fotózni.</p>
<p>Hétfőtől egy <strong>makró fotót</strong> várunk tőled, amit <a href="{uploadUrl}">itt tudsz majd feltölteni</a>, {week3DeadlineDate} 23:59-ig.</p>
<p>Ha még nem küldted be a múlt heti (épületfotós) képedet, ma éjfélig még azt is <a href="{uploadUrl}">megteheted</a>. 🕚</p>

<p>Jó fotózást,</p>
<p>--<br />
a Photato csapata</p>`,
    },
    {
        slug: '3rd-challenge-facebook-group-message',
        title: '3rd challenge: Macro',
        courseDayIndex: ((3 - 1) * 7) + 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `A harmadik heti feladat: makró fotók!

- Ha feliratkoztál, de nem találod az emailt, nézd meg az Updates, Promotions és Spam mappákban is.
- Ha még nem iratkoztál fel a tanfolyamra, lájkold az oldalt és iratkozz fel itt, értesítünk, amikor a következő kurzus indul: {signUpUrl}
- Ha még nem küldted be az épületfotódat, ne felejtsd el ma éjfélig megtenni: {uploadUrl}`,
    },
    {
        slug: '2nd-challenge-voting-facebook-group-message',
        title: '2nd challenge voting',
        courseDayIndex: ((2 - 1) * 7) + 8,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `[Galéria címe: "2. hét: épületfotók"] Megérkeztek a második heti beadások is!

- Lájkold a kedvenceidet
- Kommentelj, hogy mi tetszik a többiek fotóin, esetleg írd le, hogyan tetszenének még jobban.
- A legtöbb lájkot kapott fotó nyeri a második hetet.`, // TODO: We'll need a link in this message once we have the galleries in the website.
    },
    {
        slug: '3rd-challenge-reminder-facebook-group-message',
        title: '3rd challenge reminder',
        courseDayIndex: ((3 - 1) * 7) + 6,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Még 2 napod van feltölteni a makró fotóidat itt: {uploadUrl} – ne felejtsd el! 😊`,
    },
    {
        slug: '4th-challenge-email-current-students-message',
        title: '4th challenge: Street photography',
        courseDayIndex: ((4 - 1) * 7) + 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Negyedik hét: utcai fotózás',
        contentType: 'text/html',
        content: `<p>Kedves {firstName}!</p>

<p><img src="https://photato.eu/challenges/illustrations/lomo.jpg" alt="Lomo" style="width:100%; max-width:800px;" /></p>

<p>Nagyon örülünk, hogy ilyen sokan beküldtétek az előző három hét képeit. 😊 Nagyon jó képeket küldtök, csak így tovább, és bátran adjatok tippeket/visszajelzéseket egymásnak a galériákban.</p>
<p>A negyedik hét feladata, hogy légy néhány percre turista a saját városodban, és fotózd le az utca emberét.<br />
Ehhez <strong><a href="{ownArticleBaseUrl}/week4-street-photography">itt van egy csomó tipp, ötlet</a></strong>.</p>
<p>A legjobb utcai fotódat {week4DeadlineDate} 23:59-ig, <a href="{uploadUrl}">itt tudod feltölteni</a>, holnaptól.</p>
<p>Ha még nem küldted be a múlt heti (makró) képedet, ma éjfélig még azt is <a href="{uploadUrl}">megteheted</a>. 🕚</p>

<p>Jó fotózást,</p>

<p>--<br />
a Photato csapata</p>`,
    },
    {
        slug: '4th-challenge-facebook-group-message',
        title: '4th challenge: Street photography',
        courseDayIndex: ((4 - 1) * 7) + 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `A negyedik heti feladat: utcai fotók!

- Ha feliratkoztál, de nem találod az emailt, nézd meg a Spam mappában is.
- Ha még nem iratkoztál fel a tanfolyamra, lájkold az oldalt és iratkozz fel itt, értesítünk, amikor a következő kurzus indul: {signUpUrl}
- Ha még nem küldted be az makró fotódat, ne felejtsd el ma éjfélig megtenni: {uploadUrl}`,
    },
    {
        slug: '3rd-challenge-voting-facebook-group-message',
        title: '3rd challenge voting',
        courseDayIndex: ((3 - 1) * 7) + 8,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `[Galéria címe: "3. hét: makró fotók"]
Nagyon sok király makrót küldtetek be a múlt héten, köszönjük szépen!

- Lájkold a kedvenceidet
- Kommentelj legalább 3 képre, emeld ki, mi tetszik a fotókon, esetleg írd le, hogyan tetszenének még jobban. Ez sokat segít, hogy mindenki kapjon visszajelzést.
- A legtöbb lájkolt kép nyeri a harmadik hetet.`, // TODO: We'll need a link in this message once we have the galleries in the website.
    },
    {
        slug: '4th-challenge-reminder-facebook-group-message',
        title: '4th challenge reminder',
        courseDayIndex: ((4 - 1) * 7) + 5,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Még 3 napod van feltölteni az utcai fotóidat itt: {uploadUrl} – ne felejtsd el! 😊`,
    },
    {
        slug: 'live-event-summer-facebook-group-message',
        title: 'Live photo event (summer)',
        courseDayIndex: ((4 - 1) * 7) + 6,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `
[Title: Margitszigeti futófotók]
[Date/time: {liveEventDate} 18:00–20:00]
Content (watch out for TODO-s!):
Közös fotózás a Margitszigeten {liveEventDate} este 6-kor. Találkozó a képen látható lépcső aljánál (a lány valószínűleg nem lesz ott). Kb. itt: https://bit.ly/photatohu3-maps

A fényképezőgépekről jó eséllyel megismersz minket. 18:13-ig várunk a későn érkezőkre, utána elindulunk. Egészen kötetlen, beszélgetős-ismerkedős-fotózós eseményre számíts. :) Bárkit ér hozni. Ha jössz, jelezz az eseményre, hogy tudjuk, hány embert várjunk.

Ha vidéki vagy, akkor elnézést kérünk, hogy csak Budapesten lesz ilyen esemény. Ha van kedved, bátran írj ki eseményt a csoportban {liveEventDate} 18:00-ra a saját városodban, főleg ha többen is vagytok onnan! :)`,
    },
    {
        slug: '5th-challenge-email-current-students-message',
        title: '5th challenge: Sports photos / Fast objects',
        courseDayIndex: ((5 - 1) * 7) + 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Ötödik hét: mozgó dolgok, sportfotózás',
        contentType: 'text/html',
        content: `<p>Kedves {firstName}!</p>

<p>Ezen a héten elmagyarázunk némi elméletet, ami eddig hiányozhatott a tarsolyodból, és <strong>sportfotókat</strong> készítünk.</p>

<p>Az elméletet egy külön cikkben foglaltuk neked össze, amit <strong><a href="{ownArticleBaseUrl}/aperture-shutter-iso">itt találsz</a></strong> (ezt mindenképp érdemes elolvasnod!), a sportfotózásról, gyorsan mozgó dolgok lefényképezéséről pedig <strong><a href="{ownArticleBaseUrl}/week5-sports-photos">itt adunk tippeket, ötleteket</a></strong>.</p>

<p><strong>Tipp:</strong> Az elmélet miatt ezen a héten egy picit több időre lesz szükséged, mint az előző hetekben. Azt ajánljuk, még most döntsd el, melyik nap fogsz foglalkozni ezzel kb. 1 órát, és írd be a naptáradba. Ha ezzel megvagy, olvass tovább!</p>

<li>Egy <strong>gyorsan mozgó dologról készült fotót</strong> várunk tőled jövő vasárnapig ({week5DeadlineDate} 23:59-ig), <a href="{uploadUrl}">itt tudod majd feltölteni</a>.</li>
<p>Ha még nem küldted be a múlt heti (utcai fotós) képedet, ma éjfélig még azt is <a href="{uploadUrl}">megteheted</a>. 🕚</p>

<p>Jó fotózást,</p>

<p>--<br />
a Photato csapata</p>`,
    },
    {
        slug: '5th-challenge-facebook-group-message',
        title: '5th challenge: Sports photos / Fast objects',
        courseDayIndex: ((5 - 1) * 7) + 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Az ötödik heti feladat: sportfotók és egyéb gyors dolgok.

- Ha még nem iratkoztál fel a tanfolyamra, lájkold az oldalt és iratkozz fel itt: {signUpUrl}
- Ha még nem küldted be az utcai fotódat, még van két órád megtenni: {uploadUrl}
`,
    },
    {
        slug: '4th-challenge-voting-facebook-group-message',
        title: '4th challenge voting',
        courseDayIndex: ((4 - 1) * 7) + 8,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `[Galéria címe: "4. hét: utcai fotók"]
Megérkeztek a bátor utcai fotósok alkotásai 😊

- Lájkold a kedvenceidet
- Kommentelj legalább 3 képre, emeld ki, mi tetszik a fotókon, esetleg írd le, hogyan tetszenének még jobban. Ez sokat segít, hogy mindenki kapjon visszajelzést.
- A legtöbb lájkot kapott kép nyeri a negyedik hetet.
`, // TODO: We'll need a link in this message once we have the galleries in the website.
    },
    {
        slug: '5th-challenge-reminder-facebook-group-message',
        title: '5th challenge reminder',
        courseDayIndex: ((5 - 1) * 7) + 6,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Már érkezgetnek a mozgós képek. Itt a hétvége, menj ki fotózni, és tedd hozzájuk a tiédet, ha még nem tetted.

A legjobb képeket pedig értékes krumplikkal fogunk díjazni a tanfolyam végén. 🥔🥔🥔
Még 2 napod van feltölteni itt: {uploadUrl}`,
    },
    {
        slug: '6th-challenge-email-current-students-message',
        title: '6th challenge: Animals, plants',
        courseDayIndex: ((6 - 1) * 7) + 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Hatodik hét: állatok és növények',
        contentType: 'text/html',
        content: `<p>Kedves {firstName},</p>

<p><img src="https://photato.eu/challenges/illustrations/jellyfish.jpg" alt="Medúza" style="width:100%; max-width:800px;" /></p>

<p>A múlt héten egészen sok elméletet vettünk. Most lazítunk egy kicsit, de a helyes fókuszáláshoz adunk azért pár extra tippet.</p>

<p>Ezen a héten egy <strong>élőlényekről készült fotót</strong> várunk tőled. <a href="{uploadUrl}">Itt tudod feltölteni</a>, hétfőtől.</p>
<p><strong><a href="{ownArticleBaseUrl}/focus">A fókuszálásról itt</a></strong> tanulhatsz, <strong><a href="{ownArticleBaseUrl}/week6-animals-plants">az állatok, növények fotózásához pedig itt</a></strong> adunk tippeket. Jó tanulást, gyakorlást! 😊</p>

<p>A legjobb képedet hétfőtől, {week6DeadlineDate} 23:59-ig várjuk. Ha még nem küldted be a múlt heti (mozgásos) képedet, ma éjfélig még azt is <a href="{uploadUrl}">megteheted</a>. 🕚</p>

<p>Jó fotózást,</p>
<p>--<br />
a Photato csapata</p>`,
    },
    {
        slug: '6th-challenge-facebook-group-message',
        title: '6th challenge: Animals, plants',
        courseDayIndex: ((6 - 1) * 7) + 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `A 6. heti feladat: állatok és növények. Itt várjuk őket sok szeretettel holnaptól: {uploadUrl}

Ha még nem küldted be a sportos fotódat, éjfélig még azt is tedd meg, ugyanitt: {uploadUrl}`,
    },
    {
        slug: 'live-event-winter-facebook-group-message',
        title: 'Live photo event (winter)',
        courseDayIndex: ((6 - 1) * 7) + 4,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `
[Title: Közös fotózás az Erzsébet téren!]
[Date/time: {liveEventDate} 18:00–20:00]
Content (watch out for TODO-s!):
Hosszú záridős közös fotózás lesz Budapest belvárosában {liveEventDate} délután 6-tól 8-ig! Találkozó a medence sarkánál, ennél a kukánál: https://bit.ly/photatohu3-maps

A fényképezőgépekről jó eséllyel megismersz minket. 18:08-ig várunk a későn érkezőkre, utána elindulunk tovább a környéken. Egészen kötetlen, beszélgetős-ismerkedős-fotózós eseményre számíts. :) Bárkit ér hozni. Ha jössz, jelezz az eseményre, hogy tudjuk, hány embert várjunk!

Jó idő várható, {TODO: 16 fok, enyhén felhős}, és lesz sötét a hosszú záridős fotókhoz. ⛅
Azért választottuk ezt a hetet, mert csomó tudásotok van már, és az esti időpont jó a hosszú záridőhöz – reméljük, munka után belefér nektek is!

Hozzatok állványt, ha tudtok szerezni, jól fog jönni! Ha kérdés adódna, írjatok a Photato messengerén, vagy emailben.

Ha vidéki vagy, akkor elnézést kérünk, hogy csak Budapesten lesz ilyen esemény. Ha van kedved, bátran írj ki egy hasonló közös fotózást a csoportban {liveEventDate} du. 6-ra a saját városodban, főleg ha többen is vagytok onnan! 😊`,
    },
    {
        slug: '5th-challenge-voting-facebook-group-message',
        title: '5th challenge voting',
        courseDayIndex: ((5 - 1) * 7) + 8,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `[Galéria címe: "5. hét: sportfotók"]
A múlt héten jópár, izgalmasabbnál izgalmasabb mozgásfotót kaptunk. Ha nem küldtél be a múlt héten képet, akkor is segíthetsz a beküldőknek lájkokkal, kommentekkel. 😊`, // TODO: We'll need a link in this message once we have the galleries in the website.
    },
    {
        slug: '6th-challenge-reminder-facebook-group-message',
        title: '6th challenge reminder',
        courseDayIndex: ((6 - 1) * 7) + 6,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Még 2 napod van feltölteni a legjobb állatos fotódat itt: {uploadUrl} – ne felejtsd el! 😊`,
    },
    {
        slug: '7th-challenge-email-current-students-message',
        title: '7th challenge: Long exposure',
        courseDayIndex: ((7 - 1) * 7) + 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Hetedik hét: hosszú záridő, fényfestés',
        contentType: 'text/html',
        content: `<p>Kedves {firstName},</p>

<p>Ezen a héten a két héttel ezelőtti mozgás technikának az ellenkezőjét fogjuk megtanulni és gyakorolni. A múltkor az volt a cél, hogy nagyon élesen fotózzunk le gyorsan mozgó dolgokat. Most nem feltétlenül gyorsan mozgó dolgokat fogunk lefotózni úgy, hogy bemozduljon a kép, vagy annak bizonyos részei.</p>

<p>Egy <strong>hosszú záridős fotót</strong> várunk tőled, amihez <strong><a href="{ownArticleBaseUrl}/week7-long-exposure">ide gyűjtöttük össze neked</a></strong> a legkirályabb tippeinket.</p>
<p>A legjobb képedet <a href="{uploadUrl}">itt tudod feltölteni</a>, {week7DeadlineDate} 23:59-ig.</p>
<p>Ha még nem küldted be a múlt heti (állatos/növényes) képedet, ma éjfélig még azt is <a href="{uploadUrl}">megteheted</a>. 🕚</p>

<p>Jó fotózást,</p>

<p>--<br />
a Photato csapata</p>`,
    },
    {
        slug: '7th-challenge-facebook-group-message',
        title: '7th challenge: Long exposure',
        courseDayIndex: ((7 - 1) * 7) + 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `A hetedik heti feladat: hosszú záridős fotó. :) A szokásos címen várjuk őket, holnaptól: {uploadUrl}

Ha még nem küldted be az állatos/növényes képedet, ma éjfélig még azt is megteheted, ugyanitt: {uploadUrl}`,
    },
    {
        slug: 'mid-time-survey-email-current-students-message',
        title: 'Mid-time survey',
        courseDayIndex: ((7 - 1) * 7) + 2,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] 3 perces kérdőív',
        contentType: 'text/html',
        content: `<p>Kedves {firstName}!</p>

<p>Nagyon örülünk, hogy velünk tartottál az első 6 héten!<br />
Most szeretnénk egy pillanatra megállni és visszajelzést kapni tőled,<br />
hogy mi tetszik a tanfolyamban, és mit csinálhatnánk jobban.</p>

<p>Csináltunk ehhez egy <a href="{midTimeSurveyUrl}">kérdőívet</a>, 3 perc kitölteni.</p>

<p>Neked pár perc, nekünk hatalmas segítség. A végén ajándék krumpli vár. 🥔</p>

<p>Akkor is fontos a visszajelzésed, ha nem adtál még be feladatot!</p>

<p>Ha viszont küldtél be képeket, még fontosabb, mert itt tudod jelezni, hogy <strong>használhatjuk-e a képeidet</strong> később a tanfolyam népszerűsítésére. Légyszi ha küldtél be képeket, mindenképp töltsd ki a kérdőívet.</p>

<p><a href="{midTimeSurveyUrl}">Kattints ide a kitöltéshez!</a></p>

<p>--<br />
a Photato csapata</p>`,
    },
    {
        slug: '6th-challenge-voting-facebook-group-message',
        title: '6th challenge voting',
        courseDayIndex: ((6 - 1) * 7) + 8,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `[Galéria címe: "7. hét: hosszú záridő"]
A múlt héten számos állati jó 😉 képet kaptunk tőletek. Ha nem küldtél be a múlt héten képet, akkor is segíthetsz a beküldőknek lájkokkal, kommentekkel. 😊`, // TODO: We'll need a link in this message once we have the galleries in the website.
    },
    {
        slug: 'midtime-survey-partial-results-facebook-group-message',
        title: 'midtime-survey-results',
        courseDayIndex: ((7 - 1) * 7) + 5,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `[TODO: Tweak the take-aways by hand!] Hatalmas köszi a kérdőív-kitöltésekért! Kiderült például, hogy a sportfotókat rengetegen nehéznek találtátok (44% szerint ez volt a legnehezebb feladat eddig), ez alapján nem is csoda, hogy csak 15 kép érkezett azon a héten. A kitöltők 42%-ának kedvenc témája pedig a gasztrofotó volt. 😋
Ha még nem töltötted ki a kérdőívet, megköszönjük, ha megteszed itt: {midTimeSurveyUrl}`,
    },
    {
        slug: '7th-challenge-reminder-facebook-group-message',
        title: '7th challenge reminder',
        courseDayIndex: ((7 - 1) * 7) + 6,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Közben még 2 napod van feltölteni a hosszú záridős fotódat itt: {uploadUrl} – ne felejtsd el! 🕐`,
    },
    {
        slug: '8th-challenge-email-current-students-message',
        title: '8th challenge: Still life',
        courseDayIndex: ((8 - 1) * 7) + 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Nyolcadik hét: csendélet',
        contentType: 'text/html',
        content: `<p>Kedves {firstName}!</p>

<p style="width:100%; max-width:800px; text-align:center; font-size:smaller;">
    <img style="width:100%;" src="https://photato.eu/challenges/illustrations/jama.jpg" alt="Jama" /><br />
©   <a href="https://hu.wikipedia.org/wiki/Farkas_Antal_(fot%C3%B3m%C5%B1v%C3%A9sz)">Farkas Antal Jama</a>
</p>

<p>Az elmúlt 3 hétben sokan kültéren, komfortzónán kívüli helyzetekben fotóztatok dinamikus, nehéz témákat. Tudjuk, hogy ez gyakran trükkös volt, és ezúton gratulálunk a bátor próbálkozásokhoz és a jól sikerült fotókhoz!</p>
<p>Sunyi módon, miközben a fotózást gyakoroltad ezekben az éles helyzetekben, a fényképezőgép legbonyolultabb beállításai is bejöttek a képbe (záridő, blende és ISO érték), és gyakoroltad őket egy kicsit. A tanulás nehezén ezzel túl vagy, gratulálunk! 😊</p>
<p>Ezen a héten eggyel békésebb vizekre evezünk és biztosítjuk, hogy a fotótémád ne szaladjon el. Ami pedig az elméletet illeti, egyetlen igazán fontos beállítás van hátra: a <em>fehéregyensúly</em>.</p>

<p>Ezen a héten egy szépen beállított, <strong>csendélet-jellegű fotót</strong> várunk tőled, amit <a href="{uploadUrl}">itt tudsz feltölteni</a>, hétfőtől egészen {week8DeadlineDate} 23:59-ig.</p>

<p>A fehéregyensúlyról <strong><a href="{ownArticleBaseUrl}/white-balance">itt mesélünk neked</a></strong>, a csendélet-fotózás csínjáról-bínjáról pedig <strong><a href="{ownArticleBaseUrl}/week8-still-life">itt olvashatsz</a></strong>.</p>
<p>Ha még nem küldted be a múlt heti (hosszú exponálási idejű) képedet, ma éjfélig még azt is <a href="{uploadUrl}">megteheted</a>. 🕚</p>

<p>Jó fotózást,</p>
<p>--<br />
a Photato csapata</p>`,
    },
    {
        slug: '8th-challenge-facebook-group-message',
        title: '8th challenge: Still life',
        courseDayIndex: ((8 - 1) * 7) + 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Az e heti téma: Csendélet! Itt várjuk a fotók feltöltését holnaptól: {uploadUrl}  🍎🍇💐

Hatalmas köszi a kérdőív-kitöltésekért! Rengeteg hasznos visszajelzés jött, és megtudtuk, hogy fej-fej mellett nyert a kedvenc témák között a makrók, az utcai fotózás és az állatok-növények is! 📷😎

Ha még nem töltötted ki a kérdőívet, megköszönjük, ha megteszed itt: {midTimeSurveyUrl}`,
    },
    {
        slug: '7th-challenge-voting-facebook-group-message',
        title: '7th challenge voting',
        courseDayIndex: ((7 - 1) * 7) + 8,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `[Galéria címe: "7. hét: hosszú záridő"]
Ismét nagyon izgalmas fotókat kaptunk!

Ha esetleg a múlt héten nem is küldtél be képet, segíts a beküldőknek lájkokkal, kommentekkel. 😊
`, // TODO: We'll need a link in this message once we have the galleries in the website.
    },
    {
        slug: '8th-challenge-reminder-facebook-group-message',
        title: '8th challenge reminder',
        courseDayIndex: ((8 - 1) * 7) + 6,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Köszi a kérdőív-kitöltéseket! Ha te még nem töltötted ki, légyszi tedd meg itt: {midTimeSurveyUrl}
Emellett még 2 napod van feltölteni a Csendélet fotódat itt: {uploadUrl} 💐`,
    },
    {
        slug: '9th-challenge-email-current-students-message',
        title: '9th challenge: Portrait',
        courseDayIndex: ((9 - 1) * 7) + 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Kilencedik hét: portréfotózás',
        contentType: 'text/html',
        content: `<p>Kedves {firstName}!</p>

<p><img src="https://photato.eu/challenges/illustrations/mustache-guy.jpg" alt="Bajszos csávó" style="width:100%; max-width:800px;" /></p>

<p>A legtöbbünk életében egészen gyakran előfordul, hogy a barátainkat, családtagjainkat fotózzuk, ezért azt gondoltuk, mindannyiunknak hasznos lehet, ha megpróbálunk szintet lépni az ilyen típusú fotók készítésében. A stúdióban, tökéletesre csiszolt megvilágítással és milliós géppel készült portréfotózást meghagyjuk egy szűk elitnek, a cél inkább az, hogy megkapargassuk a portréfotózás tudományának felszínét. .</p>

<p>A 9. héten tehát <strong>portrét</strong> tanulunk meg fotózni, amihez <strong><a href="{ownArticleBaseUrl}/week9-portrait">itt vannak a heti tippjeink</a></strong>. Emellett van még egy fontos elméleti anyag, ami szeintünk rendkívül jól fog jönni a portrékhoz, ez pedig a <strong><a href="{ownArticleBaseUrl}/fov-and-focal-distance">látószög és gyújtótávolság</a></strong> témaköre.</p>

<p>A legjobb portréfotódat {week9DeadlineDate} 23:59-ig, <a href="{uploadUrl}">itt tudod majd feltölteni</a>
<p>Ha még nem küldted be a múlt heti (csendéletes) képedet, ma éjfélig még azt is <a href="{uploadUrl}">megteheted</a>. 🕚</p>

<p>Jó fotózást,</p>
<p>--<br />
a Photato csapata</p>`,
    },
    {
        slug: '9th-challenge-facebook-group-message',
        title: '9th challenge: Portrait',
        courseDayIndex: ((9 - 1) * 7) + 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `A 9. heti feladat: portré. 😎 Itt várjuk őket sok szeretettel, hétfőtől: {uploadUrl}

Ha még nem küldted be a csendélet fotódat, ezt ma éjfélig teheted meg: {uploadUrl}`,
    },
    {
        slug: '8th-challenge-voting-facebook-group-message',
        title: '8th challenge voting',
        courseDayIndex: ((8 - 1) * 7) + 8,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `[Galéria címe: "8. hét: Csendélet"]
Megjöttek a csendélet-fotók!`, // TODO: We'll need a link in this message once we have the galleries in the website.
    },
    {
        slug: '9th-challenge-reminder-facebook-group-message',
        title: '9th challenge reminder',
        courseDayIndex: ((9 - 1) * 7) + 6,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Ne feledd, még 2 napod van feltölteni a legjobb portrédat itt: {uploadUrl} 😊`,
    },
    {
        slug: '10th-challenge-email-current-students-message',
        title: '10th challenge: Events',
        courseDayIndex: ((10 - 1) * 7) + 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] 10. hét: eseményfotózás',
        contentType: 'text/html',
        content: `<p>Kedves {firstName}!</p>

<p><img src="https://photato.eu/challenges/illustrations/concert.jpg" alt="Koncert Buffalo WY" style="width:100%; max-width:800px;" /></p>

<p>Ismét egy sokakat érintő témával jövünk: a csoportos események fényképezésével. Legyen az buli, családi összejövetel, esküvő vagy koncert, valószínűleg sokan fognak kattogtatni közben a telefonjukkal, köztük talán te is. Megpróbálunk segíteni, hogy minél jobb fotókat lőj az ilyen helyzetekben, akár fényképezőgéppel, akár mobillal.</p>

<p>A témához kapcsolódó tippjeinket <strong><a href="{ownArticleBaseUrl}/week10-event-photography">itt találod</a></strong>, a legjobb eseményfotód pedig hétfőtől {week10DeadlineDate} 23:59-ig, <a href="{uploadUrl}">itt tudod majd feltölteni</a>.
<p>Ha még nem küldted be a múlt heti (portré) képedet, ma éjfélig még azt is <a href="{uploadUrl}">megteheted</a>. 🕚</p>

<p>Jó fotózást,</p>
<p>--<br />
a Photato csapata</p>`,
    },
    {
        slug: '10th-challenge-facebook-group-message',
        title: '10th challenge: Events',
        courseDayIndex: ((10 - 1) * 7) + 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `A 10. heti feladat: eseményfotózás. A fotókat itt várjuk holnaptól sok szeretettel: {uploadUrl}

Ha még nem küldted be a portréfotódat, ma éjfélig még azt is megteheted: {uploadUrl} :)
`,
    },
    {
        slug: '9th-challenge-voting-facebook-group-message',
        title: '9th challenge voting',
        courseDayIndex: ((9 - 1) * 7) + 8,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `[Galéria címe: ""]
Máris itt a következő galéria: a gyönyörű portrék. Lájkolj, kommentelj bátran, mert a sok lájkot kapott emberek krumplit kapnak, és mint az ősi mondás tartja, 🥔 = ❤️.`, // TODO: We'll need a link in this message once we have the galleries in the website.
    },
    {
        slug: '10th-challenge-reminder-facebook-group-message',
        title: '10th challenge reminder',
        courseDayIndex: ((10 - 1) * 7) + 6,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Szuper időnk van. 😊 Ne felejtsétek holnap estig elkészíteni és beküldeni a remek eseményfotótokat. Ide ni: {uploadUrl} :)`,
    },
    {
        slug: '11th-challenge-email-current-students-message',
        title: '11th challenge: Self portrait',
        courseDayIndex: ((11 - 1) * 7) + 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] 11. hét: túl a selfie-n',
        contentType: 'text/html',
        content: `<p>Kedves {firstName}!</p>
<p><img src="https://photato.eu/challenges/illustrations/gyuri.jpg" alt="Gyuri összeverve" style="width:100%; max-width:800px;" /></p>

<p>Az utolsó előtti hét feladata egy olyan kép elkészítése, ahol te vagy a tárgy és az alkotó is egyben. Ez lehet egy gyors selfie, vagy egy jobban megtervezett, profibb kompozíció is, az elmúlt hetekben tanult technikákat felhasználva.</p>
<p>Mindenesetre <strong><a href="{ownArticleBaseUrl}/week11-self-portrait">hoztunk hozzá néhány tippet</a></strong>, hogy ebből a témából is ki tudd hozni a legtöbbet.</p>
<p>A legjobb önarcképed {week11DeadlineDate} 23:59-ig, <a href="{uploadUrl}">itt tudod majd feltölteni</a>.</p>
<p>Gyors emlékeztető: Ha még nem küldted be a múlt heti (esemény) képedet, ma éjfélig még azt is <a href="{uploadUrl}">megteheted</a>. 🕚</p>

<p>Jó fotózást,</p>

<p>--<br />
a Photato csapata</p>`,
    },
    {
        slug: '11th-challenge-facebook-group-message',
        title: '11th challenge: Self portrait',
        courseDayIndex: ((11 - 1) * 7) + 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `A 11. heti feladat: önarckép. A selfie-ket és nem selfie-ket hétfőtől itt várjuk sok szeretettel: {uploadUrl}

Ha még nem küldted be az eseményfotódat, ma éjfélig az is jöhet: {uploadUrl}`,
    },
    {
        slug: '10th-challenge-voting-facebook-group-message',
        title: '10th challenge voting',
        courseDayIndex: ((10 - 1) * 7) + 8,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `[Galéria címe: "10. hét: eseményfotók"]
Itt vannak a kiváló eseményfotók! 😊 A legtöbb lájkot kapott kép nyeri a 10. hetet és a krumplikat. 🥔🥔`, // TODO: We'll need a link in this message once we have the galleries in the website.
    },
    {
        slug: '11th-challenge-reminder-facebook-group-message',
        title: '11th challenge reminder',
        courseDayIndex: ((11 - 1) * 7) + 6,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Még két napod van feltölteni az önarcképedet itt: {uploadUrl} – ne felejtsd el, ez az utolsó előtti hét! 😊`,
    },
    {
        slug: '12th-challenge-email-current-students-message',
        title: '12th challenge: Freestyle',
        courseDayIndex: ((12 - 1) * 7) + 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] 12., utolsó hét: freestyle – fotózz szabadon!',
        contentType: 'text/html',
        content: `<body>
<p>Kedves {firstName}!</p>

<p>Ezen a héten lazára eresztjük az elvárásokat, és bármilyen képet elfogadunk. Emellett kicsit visszatekintünk az elmúlt 11 hétre, és megnézzük, hogyan érdemes továbbmenned a fotózás-tanulás útján.</p>

<p>A <strong><a href="{ownArticleBaseUrl}/week12-freestyle-and-review">visszatekintést és tippeket itt találod</a></strong>, a (többnyire ingyenes) továbbtanulási ötleteinkről pedig <strong><a href="{ownArticleBaseUrl}/after-photato">ezt a cikket hoztuk neked</a></strong>.</p>

<p>A legjobb <em>bármilyen</em> képedet {week12DeadlineDate} 23:59-ig, <a href="{uploadUrl}">itt tudod majd feltölteni</a>.</p>

<p>Köszi, hogy részt vettél a kurzuson! Mi nagyon élveztük, örültünk a rengeteg pozitív visszajelzésnek és konstruktív kritikának. 😊 Még nem búcsúzkodunk, hiszen még van egy hét, és egy fotókiállítás, amiről hamarosan írunk! Viszont akartunk szólni, hogy hamarosan újabb tanfolyamot indítunk. Sokan írtátok, hogy szívesen ajánlanátok a Photatot a barátaitoknak/kollégáitoknak. Gondoltuk, ez egy remek alkalom, hogy segítséget adjunk ehhez.</p>
<p>Itt van pl. egy rövid üzenet, amit átküldhetsz azoknak, akiket szerinted érdekelhet:</p>
<hr>
<p><em>Képzeld, az elmúlt hetekben fotózni tanultam egy online suliban, és pár hét múlva indul egy újabb kurzusuk!<br />
    Arra gondoltam, téged is érdekelhet a fotózás.<br />
    Ha így van, iratkozz fel itt: <a href="{signUpUrl}">{signUpUrl}</a></em>
</p>
<hr>
<p>Vagy kiírhatsz valami ilyesmit a faladra:</p>
<hr>
<p><em>Az elmúlt hetekben fotózni tanultam egy ingyenes, online suliban, és nagyon király volt. Hamarosan indul a következő kurzusuk, ajánlom mindenkinek! Ha érdekel, iratkozz fel itt: <a href="{signUpUrl}">{signUpUrl}</a></em>
</p>
<hr>
<p>És még egy dolog:</p>
<p><strong>Mentorokat keresünk!</strong> Sokan jeleztétek, hogy jó lett volna több visszajelzés a képeitekre, viszont nekünk sajnos nem volt erre annyi időnk, mint szerettük volna. Ha érzed magadban az erőt, hogy besegíts nekünk kommentálni a beérkező képeket, küldj egy levelet a <a href="mailto:photatophotato@gmail.com?subject=Mentor">photatophotato@gmail.com</a> címre. Egy egy soros email teljesen elég, hogy „Mentornak jelentkezem”, a többiről emailben egyeztetünk. Nem jár hatalmas felelősséggel, de nekünk nagy segítség. 😊</p>
<p>Hát, így. 😊</p>
<p>Ha még nem küldted be a múlt heti (önarckép) képedet, ma éjfélig még azt is <a href="{uploadUrl}">megteheted</a>. 🕚</p>
<p>Az e heti képeket pedig hétfőtől, <a href="{uploadUrl}">ugyanitt</a> várjuk!</p>

<p>Jó fotózást,</p>
<p>--<br />
a Photato csapata</p>
`,
    },
    {
        slug: '12th-challenge-facebook-group-message',
        title: '12th challenge: Freestyle',
        courseDayIndex: ((12 - 1) * 7) + 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Az utolsó, 12. heti feladat: freestyle. Bármit fotózhatsz, itt várjuk sok szeretettel: {uploadUrl} :)

Ha még nem küldted be az önarcképedet, ez ma éjfélig jöhet: {uploadUrl}

A kurzus végével és a következő tanfolyammal kapcsolatos információkat hamarosan küldjük. 😊`,
    },
    {
        slug: '11th-challenge-voting-facebook-group-message',
        title: '11th challenge voting',
        courseDayIndex: ((11 - 1) * 7) + 8,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `[Galéria címe: "11. hét: önarckép"]
Megérkeztek az önarcképek – gratulálunk minden bátor beküldőnek! 😊 Lájkoljatok, kommenteljetek!`, // TODO: We'll need a link in this message once we have the galleries in the website.
    },
    {
        slug: '12th-challenge-reminder-facebook-group-message',
        title: '12th challenge reminder',
        courseDayIndex: ((12 - 1) * 7) + 6,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Még hátra van a hétvége, hogy beküldd az utolsó heti fotódat: {uploadUrl} Freestyle fotó, azaz bármit szabad! Ha tetszett a kurzus, küldj be egy képet! 😊`,
    },
    {
        slug: 'exhibition-facebook-group-message',
        title: 'Exhibition (Facebook event)',
        courseDayIndex: ((12 - 1) * 7) + 7,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `
[Title: Photato fotókiállítás / photo exhibition]
[Date/time: {exhibitionDate} 19:00–21:00]
[Keywords: Keywords: fotó tanfolyam kiállítás fotókiállítás krumpli photo exhibition course potato]
[Watch out for TODOs!]
A Photato első kurzusának záróakkordjaként csütörtökön este kiállítjuk a legjobb képeket a Szimplában. A nyertes képek fotósai értékes nyereményekben részesülnek! Díjátadó 20:00-kor! Jelezzetek vissza, hogy tudjuk, mennyien leszünk! :) Csütörtökön találkozunk! 🥔

Same in English:

We've just finished the latest course of “Photato: 12 weeks, 12 shots”. The best photos will be displayed Thursday night in Szimpla, and you can meet the artists whose shots will be awarded with valuable potatoes. Indicate if you're coming! See you on Thursday! :)`,
    },
    {
        slug: '12th-challenge-voting-facebook-group-message',
        title: '12th challenge voting',
        courseDayIndex: ((12 - 1) * 7) + 8,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `[Galéria címe: "12. hét: freestyle"]
Megérkeztek az utolsó heti képek! Gyorsan szavazzatok rájuk, mert holnap délután 2-kor lezárjuk a szavazást, az akkori sorrend alapján nyer a legtöbb lájkot kapott kép. Csütörtökön ({exhibitionDate}) pedig találkozunk a Szimplában (ld. a Facebook eseményt)! 😊`, // TODO: We'll need a link in this message once we have the galleries in the website.
    },
    {
        slug: 'exhibition-invitation-email-winners-message',
        title: 'Exhibition for winners',
        courseDayIndex: ((13 - 1) * 7) + 2,
        channel: channels.email,
        audience: emailAudiences.winners,
        locale: 'hu-HU',
        subject: '[Photato] Eredményhirdetés',
        contentType: 'text/html',
        content: `Szia!

Baráti tipp: Ha Te lennék, én benéznék a csütörtök ({exhibitionDate}) esti eredményhirdetésre, hátha nyertél valamit! 😉

Az infók:

A Photato harmadik kurzusának záróakkordjaként csütörtökön este kiállítjuk a legjobb képeket a virtuális térben, amit összekötünk egy pogácsázással-borozással ZOOM-on! Természetesen tea, süti is választható, sőt, mivel mindenki otthonról fog csatlakozni, azzal készülsz, amivel szeretnél! :)

A nyertes képek fotósai értékes nyereményekben részesülnek! Díjátadó 20:00-kor! A ZOOM linket röviddel az esemény előtt küldjünk, ahol tudsz majd kapcsolódni.

Csütörtökön találkozunk! 🥔

Üdv,
A Photato csapata
`,
    },
    {
        slug: 'exhibition-reminder-facebook-group-message',
        title: 'Event reminder',
        courseDayIndex: ((13 - 1) * 7) + 4,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Hamarosan találkozunk, és kihirdetjük a nyerteseket, már nagyon izgatottak vagyunk! 🥔
20:00-kor várunk Titeket ezen a Zoom linken:
https://zoom.us/j/9995559876?pwd=ZW5tSzBjUERzNktyalhSRk1COWFFQT09 

A Zoom használható laptopról, tabletről és mobilról is. Tudjátok telepíteni az alkalmazást, ezt automatikusan felajánlja, amikor rákattintotok a fenti linkre, válasszátok a ’dowload and run Zoom’ lehetőséget. Választhatjátok azt is, hogy a böngészőből csatlakoztok, ehhez kattintsatok arra, hogy ’join from your browser’. Ha nehézségetek lenne a belépéssel, írjatok és segítünk! :)
`,
    },
    {
        slug: 'farewell-email-winners-message',
        title: 'Farewell',
        courseDayIndex: ((14 - 1) * 7) + 0,
        channel: channels.email,
        audience: emailAudiences.winners,
        locale: 'hu-HU',
        subject: '[Photato] Viszlát, és köszi a fotókat',
        contentType: 'text/html',
        content: `<p>Kedves {firstName},</p>
<p>Ez az utolsó levél, amit a mostani Photato kurzussal kapcsolatban küldünk neked.</p>
<p>Köszönjük, hogy velünk tartottál. 😊</p>
<p>Gratulálunk a nyerteseknek! 🏆 <a href="{TODO}">A legjobbnak ítélt 12 fotót itt</a> tudod megnézni.</p>
<p>Néhány érdekes adat:</p>
<ul>
<li>👪 {signedUpCount} lelkes fotóstársaddal vettetek részt a tanfolyamon,</li>
<li>🖼 Összesen {TODO: 616} beadást kaptunk,</li>
<li>👀 Már {TODO: 407}-en követitek a Facebook oldalt.</li>
</ul>
<p>Rengeteget tanultunk a mostani kurzusból, és megmaradt a lelkesedésünk is, úgyhogy ha alábbhagy a 🦠 koronavírusos bezárkózás, el is indítjuk a következő tanfolyamot, és erről emailben értesíteni fogunk! Ez felépítésében nagyon hasonló lesz a mostanihoz, de a visszajelzéseitek alapján több dolgot kijavítunk. Az előző kurzus óta pl. ezek változtak:</p>
<ul>
<li>🍠 Lett egy aktív Facebook csoport, ahol tudtatok képeket megosztani, beszélgetni, kérdezni.</li>
<li>🥕 A 8. hét környékén megkértünk titeket, hogy csak friss képet küldjetek be a heti beadásotoknak.</li>
<li>🥜 A 6. héten volt egy élő esemény a Budapestieknek az Erzsébet téren, amikor összegyűltünk és együtt fotóztunk. Ezt utólag is nagyon köszönjük, mi igazán jól éreztük magunkat. 😊</li>
</ul>
<p>A következő kurzusra saját honlappal készülünk, hogy egy kicsit eltávolodjunk a Facebooktól, és hogy kényelmesebb legyen a képfeltöltés meg pár egyéb dolog. Emellett nagyobb hangsúlyt igyekszünk fektetni a visszajelzésekre, mentori kommentekre.</p>
<p><strong>2 kérés</strong> tőlünk a tanfolyam lezárása kapcsán:</p>
<ol>
<li>❓ <strong>Válaszolj pár kérdésünkre:</strong> Készítettünk egy 3 perces <a href="{finalSurveyUrl}">kurzus végi kérdőívet</a>. Csak 9 kérdésből áll, és mind opcionális. Légyszi töltsd ki, rengeteget segítesz a visszajelzéseddel, még akkor is, ha egyébként kevésbé voltál aktív a tanfolyamon.</li>
<li>🌟 <strong>Értékelj a Facebook oldalon:</strong> Még csak néhány visszajelzésünk van a Facebook oldalon. Ha van 2 perced segíteni nekünk, <a href="https://www.facebook.com/photato12/reviews/">írj egyet te is</a>.</li>
</ol>
<p>A továbbiakban legfeljebb évi 4 emailt szeretnénk neked küldeni, az új kurzusokkal kapcsolatban. De ha ez is túl sok, bátran leiratkozhatsz itt lejjebb, örülünk, hogy eddig velünk tartottál. 😊</p>
<p>További jó fotózást 📸 kívánunk,</p>
<p>-- <br />a Photato csapata 🥔</p>
`, // TODO this needs updating
    },
];

module.exports = {
    emailAudiences,
    facebookAudiences,
    channels,
    photatoMessages,
};