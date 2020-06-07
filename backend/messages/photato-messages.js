// TODO: Replace *|FNAME|* with {firstName} in emails!
// TODO: Add [Photato] to email subjects
// TODO: Set courseDayIndex everywhere, it's not set yet!

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
// {courseStartDate} (a nicely formatted date)
// {signedUpCount} → 27 (just a number)
// {signUpUrl} → https://bit.ly/2tB1hpR (plain text)
// {facebookGroupUrl} → bit.ly link (plain text)
// {courseTitle} → e.g. "2020. őszi Photato tanfolyam"
// {firstName} → Student's first name
// {uploadUrl} → https://photato.eu/upload
// {midTimeSurveyUrl} → The URL

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
        slug: 'old-group-closing-facebook-previous-group-message',
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
        slug: 'minus-3-days-email-current-students-message',
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
        slug: 'minus-1-day-email-current-students-message',
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
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Első heti feladat: gasztrofotó',
        contentType: 'text/html',
        content: `<p>Kedves *|FNAME|*!</p>
<p><strong>Röviden:</strong></p>
<p>Az első hét témája: <strong>gasztrofotó</strong>!</p>
<p>A legjobb képedet <a href="https://bit.ly/phhu3w1">itt tudod feltölteni</a>.</p>
<p><strong>Hosszabban:</strong></p>

<p><img src="https://gallery.mailchimp.com/0305d4c45bf55547841755d47/images/34187a74-1735-4b91-8f4c-6da400f58c32.jpg" alt="pizza" style="width:100%; max-width:800px;"></p>
<p>A gasztrofotózást tökéletes első témának tartjuk, mert kevés lelkesítőbb fotós kihívást ismerünk, mint finom, színes kajákat fényképezni 😋, és mert a legtöbben azért még bőven tanulhatunk arról, hogy hogyan lehet ezt igazán profin csinálni.</p>

<p><strong>Az első heti feladatod</strong> tehát ételeket/italokat fotózni, kiválasztani közülük a legjobbat, és március 11. 23:59-ig feltölteni <a href="https://bit.ly/phhu3w1">ezen a linken</a>. A beazonosításhoz fontos, hogy a kép neve az email címed legyen: pl. “krumplipuree12@gmail.com.jpg”.</p>

<!-- TODO: Add link here! -->

<p>Várjuk a képeket <a href="https://bit.ly/phhu3w1">itt</a>! A legjobb beküldött képek díjazásban részesülnek.</p>

<p>Üdv,</p>

<p>-- <br>
a Photato csapata</p>
`,
    },
    {
        slug: '1st-challenge-facebook-group-message',
        title: '1st challenge: Food photos',
        courseDayIndex: 0,
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
        courseDayIndex: 0,
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
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Második hét: épületek',
        contentType: 'text/html',
        content: `<p>Kedves *|FNAME|*!</p>

<p><strong>Röviden:</strong></p>
<p>A második hét témája: <strong>épületfotók</strong>!</p>
<p>Közben gyorsan megtanuljuk, mi a zoom, a blende és a záridő.</p>
<p>A legjobb képedet <a href="https://bit.ly/phhu3w2">itt tudod feltölteni</a>.</p>

<p><strong>Hosszabban:</strong></p>

<p><img src="https://gallery.mailchimp.com/0305d4c45bf55547841755d47/images/ea78eb3e-9f0c-46a9-b4fc-21e2f45cf523.jpg" alt="Nyugati tér" style="width:100%; max-width:800px;"></p>

<p>Az e heti feladat épületek, nevezetességek, terek fotózása lesz. A legjobb képedet június 17. 23:59-ig, <a href="https://bit.ly/phhu3w2">itt tudod feltölteni</a>.</p>

<p>A múlt héthez hasonlóan most is megpróbáltuk összeszedni nektek a legjobb tippjeinket:</p>

<ol>
    <li><strong>Nézz körül.</strong> Figyeld meg a környezeted. A legtöbben nem vesszük észre, milyen király épületek mellett megyünk el mindennap. Nézz magasabbra, mint szoktál!</li>
    <li><strong>Tanulj egy kis elméletet.</strong> Ha tisztában vagy a fényképezés alapjaival, sokkal több lehetőséged lesz érdekes képeket csinálni. Különösen, ha fényképezőgépet használsz, vagy van profi kamera alkalmazás a telefonodon (Camera FV-5 Androidra – <a href="https://play.google.com/store/apps/details?id=com.flavionet.android.camera.lite">0ft</a> / <a href="https://play.google.com/store/apps/details?id=com.flavionet.android.camera.pro">899ft</a>, <a href="https://apps.apple.com/us/app/procam-7/id730712409">ProCam 7 iOS-re</a> – 2290ft).<br>Remek kiindulópont ez a 10 perces cikk, érdemes elolvasni: <a href="https://fotozasblog.hu/digitalis-fotozas/">Fotózás alapok: zoom, blende, záridő</a>.</li>
    <li><strong>Menj messzebb.</strong> Ha a teljes épületet akarod fotózni, figyelj rá, hogy valóban az egész épület beleférjen a képbe. Ha <a href="https://fotozasblog.hu/digitalis-fotozas/#optikaizoom">nagy látószögű</a> optikád van, könnyű a dolgod, de ha nincs, érdemes hátrébb menni.</li>
    <li><strong>Keresd meg a nézőpontod.</strong> Sétálj körbe, találd meg a magasságot. Nézz körül, honnan fotózhatsz még, ami nem magától értetődő: szomszédos épületről, távolról rázoomolva stb.</li>
    <li><strong>Állítsd be a kamerád.</strong> Ha kell, használj szűkebb <a href="https://fotozasblog.hu/digitalis-fotozas/#melysegelesseg">blende</a> beállítást, hogy nagyobb legyen az éles tartomány. Itt egy <a href="https://i.imgur.com/IFRun0e.gif">gif a mélységélességről</a>.</li>
    <li><strong>Figyelj a kontextusra.</strong> Keretezd a kompozíciót más épületekkel, tárgyakkal. Ha emberek, autók vannak az épület körül, légy türelmes és várd meg, amíg elmennek, vagy fogadd el és használd őket, pl. a méretek érzékeltetésére.</li>
    <li><strong>Este használj állványt.</strong> Ha este/éjszaka fotóznál, használj állványt, vagy tedd le egy stabil helyre a gépet. Ha nincs állványod, jó trükk tud lenni egy pulcsira/sálra tenni a géped, és úgy beállítani. Telefonnal ez eggyel nehezebb, de egy idő után mindig sikerül megoldani. 😊</li>
</ol>

<p>Variációk:</p>
<ul>
    <li><strong>Zoomolj rá.</strong> Keress izgalmas kivágásokat, ahol érdekes a geometria vagy épületszobrászat. Ha menő, cserélhető objektíves géped van, használj a nagy látószögű lencse mellett teleobjektívet, vagy csak zoomolj rá a részletekre.</li>
    <li><strong>Menj be.</strong> És nézz körül. Sok épület belül is tartogat jól fotózható meglepetéseket.</li>
    <li><strong>Játssz az idővel.</strong> Fotózd le ugyanazt az épületet különböző időpontokban és időjárásban: hajnalban, reggel, délelőtt, délután, napnyugtakor, este. Napsütésben, esőben, havazásban (irány Norvégia! 😉), felhős ég alatt. Figyeld meg, hogy mikor mennyire kontrasztos, színekben gazdag, drámai a kép. Egy rossz időben készült fotónak is lehet érdekes hangulata. Ha nagyon színtelen a kép, készíts fekete-fehér fotókat. Délben nincs sok árnyék és hideg a fény. Állítsd be a fehéregyensúlyt az időnek megfelelően. (A fehéregyensúlyról majd még tanulunk később, de érdeklődőknek <a href="https://fotozasblog.hu/feher-egyensuly-beallitas-viszlat-sarga-fotok/">itt egy cikk elöljáróban</a>.)</li>
    <li><strong>Tükrözz.</strong> Használd ki a környezet felületeit: keress tükröződéseket egy pocsolyán vagy egy üvegfelületen</li>
    <li><strong>Szűrj.</strong> Ha profi fotócuccod van, próbálj ki egy sötét szűrőt, hogy nappal is hosszabb záridővel fotózhass és elmosódjanak az emberek.</li>
    <li><strong>Omolj.</strong> Fotózz omladozó, pusztuló épületeket, gyárakat.</li>
    <li><strong>Plankelj.</strong> Milliószor ugyanúgy lefotózott híres épületek? <a href="https://photos.google.com/share/AF1QipOKmg5KfTa4Wpw--Cd5DPvkSvoD-QtJhIAvzaJQRN08VUc2zbbqyx2uclUAnOTN_Q/photo/AF1QipODii3F28joTq0GKpH3GIwH-aIvdqYEuzcRXR3l?key=bVhnaUZ6Z2pHNnFjOHZOQUtUWkVva0RUbUUwRldn">Feküdj be a képbe</a>.</li>
</ul>

<p>Linkek:</p>
<ul>
    <li>A legjobban a fentebb is linkelt <a href="https://fotozasblog.hu/digitalis-fotozas/">fotózás alapok: zoom, blende, záridő</a> cikket ajánljuk.</li>
    <li>További <a href="https://sg.hu/cikkek/it-tech/43737/hogyan-fotozzunk-varosok-megorokitese">tippek városi fotózáshoz</a> az sg.hu-n.</li>
    <li>Még <a href="https://www.canon.hu/get-inspired/tips-and-techniques/city-photography/">tippek városi fotózáshoz</a> a Canontól.</li>
</ul>

<p>Inspiráció: <a href="https://hu.pinterest.com/search/pins/?q=building%20photography">Pinterest</a> | <a href="https://hu.pinterest.com/search/pins/?q=budapest%20buildings">Pinterest / Budapest</a> | Mobile Photo Awards épületfotó győztesek: <a href="https://mobilephotoawards.com/architecture-design-winners-8th-annual-mpa/">2018</a> | <a href="https://mobilephotoawards.com/architecture-design-winner-honorable-mentions-7th-annual-mpa/">2017</a> | <a href="https://mobilephotoawards.com/architecture-design-winner-honorable-mentions-6th-mpa/">2016</a> | <a href="https://mobilephotoawards.com/architecture-design/">2015</a> | <a href="https://mobilephotoawards.com/architecture-design-2014-mpa-results/">2014</a> | <a href="https://mobilephotoawards.com/2013-mobile-photography-awards-architecturedesign-category-winners/">2013</a></p>

<p>Ha még nem küldted be a múlt heti (gasztrofotó) képedet, ma éjfélig még azt is <a href="https://bit.ly/phhu3w1">megteheted</a>. 🕚</p>

<p>Az épületes képeket pedig <a href="https://bit.ly/phhu3w2">ide</a> várjuk!</p>

<p>Jó fotózást,</p>

<p>-- <br>
a Photato csapata</p>
`,
    },
    {
        slug: '2nd-challenge-facebook-group-message',
        title: '2nd challenge: Buildings',
        courseDayIndex: 0,
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
        courseDayIndex: -2,
        channel: channels.email,
        audience: emailAudiences.mentors,
        locale: 'hu-HU',
        subject: 'Photato galéria kommentelés infók',
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
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `[Galéria címe: "1. hét: gasztrofotók"]
Megérkeztek az első heti beadások!

- Lájkold a kedvenceidet,
- Írj bátran konstruktív véleményt a többiek fotóira. Úgy írj, ahogy te is örülnél, hogy írjanak a saját képeidről! 
- A lájkok sokat segítenek majd eldönteni, hogy melyik fotó nyeri a hetet,
- Ha gondolod, iratkozz fel a saját képedre, hogy megkapd a kommentekről az értesítést, ezt így teheted meg: http://bit.ly/38r3Jy9  - jobb felül a három pöttyre kattintva, értesítések bekapcsolása.

Hajrá! 😊`, // TODO: We'll need a link in this message once we have the galleries in the website.
    },
    {
        slug: 'facebook-group-reminder-email-mentors-message',
        title: 'Facebook group reminder',
        courseDayIndex: -2,
        channel: channels.email,
        audience: emailAudiences.mentors,
        locale: 'hu-HU',
        subject: '[Photato] Megérkeztek az első fotók a Facebook csoportba!',
        contentType: 'text/html',
        content: `<p>Kedves *|FNAME|*!</p>
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
        courseDayIndex: 0,
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
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Harmadik hét: makró',
        contentType: 'text/html',
        content: ``, // TODO
    },
    {
        slug: '3rd-challenge-facebook-group-message',
        title: '3rd challenge: Macro',
        courseDayIndex: 0,
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
        courseDayIndex: 0,
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
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Még 2 napod van feltölteni a makró fotóidat itt: {uploadUrl} – ne felejtsd el! 😊`,
    },
    {
        slug: '4th-challenge-email-current-students-message',
        title: '4th challenge: Street photography',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Negyedik hét: utcai fotózás',
        contentType: 'text/html',
        content: ``, // TODO
    },
    {
        slug: '4th-challenge-facebook-group-message',
        title: '4th challenge: Street photography',
        courseDayIndex: 0,
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
        courseDayIndex: 0,
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
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Még 3 napod van feltölteni az utcai fotóidat itt: {uploadUrl} – ne felejtsd el! 😊`, // TODO
    },
    {
        slug: 'live-event-summer-facebook-group-message',
        title: 'Live photo event (summer)',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `
Title: Margitszigeti futófotók
Times: 18:00-20:00
Content (watch out for TODO-s!):
Közös fotózás a Margitszigeten {TODO: 2018. július 4. szerda} este 6-kor. Találkozó a képen látható lépcső aljánál (a lány valószínűleg nem lesz ott). Kb. itt: https://bit.ly/photatohu3-maps

A fényképezőgépekről jó eséllyel megismersz minket. 18:13-ig várunk a későn érkezőkre, utána elindulunk. Egészen kötetlen, beszélgetős-ismerkedős-fotózós eseményre számíts. :) Bárkit ér hozni. Ha jössz, jelezz az eseményre, hogy tudjuk, hány embert várjunk.

Ha vidéki vagy, akkor elnézést kérünk, hogy csak Budapesten lesz ilyen esemény. Ha van kedved, bátran írj ki eseményt a csoportban {TODO: július 4.} 18:00-ra a saját városodban, főleg ha többen is vagytok onnan! :)`,
    },
    {
        slug: '5th-challenge-email-current-students-message',
        title: '5th challenge: Sports photos / Fast objects',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Ötödik hét: mozgó dolgok, sportfotózás',
        contentType: 'text/html',
        content: ``, // TODO
    },
    {
        slug: '5th-challenge-facebook-group-message',
        title: '5th challenge: Sports photos / Fast objects',
        courseDayIndex: 0,
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
        courseDayIndex: 0,
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
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Ezen a héten szokatlanul kevés kép érkezett be eddig, ami két dolgot jelent:
1. Hogy még nagyon kevesen küldtetek be képet 😉
2. Hogy potenciálisan kisebb lesz a verseny, mint az előző hetekben, így ha beküldöd, nagyobb eséllyel lesz a tiéd a legjobbnak ítélt kép. 😊

A legjobb képeket pedig értékes krumplikkal fogunk díjazni a tanfolyam végén. 🥔🥔🥔
Még 2 napod van feltölteni itt: {uploadUrl}`,
    },
    {
        slug: '6th-challenge-email-current-students-message',
        title: '6th challenge: Animals, plants',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Hatodik hét: állatok és növények',
        contentType: 'text/html',
        content: ``, // TODO
    },
    {
        slug: '6th-challenge-facebook-group-message',
        title: '6th challenge: Animals, plants',
        courseDayIndex: 0,
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
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `
Title: Közös fotózás az Erzsébet téren!
Times: 18:00-20:00
Content (watch out for TODO-s!):
Hosszú záridős közös fotózás lesz Budapest belvárosában {TODO: 2020. február 25. kedd} délután 6-tól 8-ig! Találkozó a medence sarkánál, ennél a kukánál: https://bit.ly/photatohu3-maps

A fényképezőgépekről jó eséllyel megismersz minket. 18:08-ig várunk a későn érkezőkre, utána elindulunk tovább a környéken. Egészen kötetlen, beszélgetős-ismerkedős-fotózós eseményre számíts. :) Bárkit ér hozni. Ha jössz, jelezz az eseményre, hogy tudjuk, hány embert várjunk!

Jó idő várható, {TODO: 16 fok, enyhén felhős}, és lesz sötét a hosszú záridős fotókhoz. ⛅
Azért választottuk ezt a hetet, mert csomó tudásotok van már, és az esti időpont jó a hosszú záridőhöz – reméljük, munka után belefér nektek is!

Hozzatok állványt, ha tudtok szerezni, jól fog jönni! Ha kérdés adódna, írjatok a Photato messengerén, vagy emailben.

Ha vidéki vagy, akkor elnézést kérünk, hogy csak Budapesten lesz ilyen esemény. Ha van kedved, bátran írj ki egy hasonló közös fotózást a csoportban {TODO: február 25.} du. 6-ra a saját városodban, főleg ha többen is vagytok onnan! 😊`,
    },
    {
        slug: '5th-challenge-voting-facebook-group-message',
        title: '5th challenge voting',
        courseDayIndex: 0,
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
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Még 2 napod van feltölteni a legjobb állatos fotódat itt: {uploadUrl} – ne felejtsd el! 😊`,
    },
    {
        slug: '7th-challenge-email-current-students-message',
        title: '7th challenge: Long exposure',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Hetedik hét: hosszú záridő, fényfestés',
        contentType: 'text/html',
        content: ``, // TODO
    },
    {
        slug: '7th-challenge-facebook-group-message',
        title: '7th challenge: Long exposure',
        courseDayIndex: 0,
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
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] 3 perces kérdőív',
        contentType: 'text/html',
        content: `<p>Kedves *|FNAME|*!</p>

<p>Nagyon örülünk, hogy velünk tartottál az első 6 héten!<br>
Most szeretnénk egy pillanatra megállni és visszajelzést kapni tőled,<br>
hogy mi tetszik a tanfolyamban, és mit csinálhatnánk jobban.</p>

<p>Csináltunk ehhez egy <a href="{midTimeSurveyUrl}">kérdőívet</a>, 3 perc kitölteni.</p>

<p>Neked pár perc, nekünk hatalmas segítség. A végén ajándék krumpli vár. 🥔</p>

<p>Akkor is fontos a visszajelzésed, ha nem adtál még be feladatot!</p>

<p>Ha viszont küldtél be képeket, még fontosabb, mert itt tudod jelezni, hogy <strong>használhatjuk-e a képeidet</strong> később a tanfolyam népszerűsítésére. Légyszi ha küldtél be képeket, mindenképp töltsd ki a kérdőívet.</p>

<p><a href="{midTimeSurveyUrl}">Kattints ide a kitöltéshez!</a></p>

<p>--<br>
a Photato csapata</p>`,
    },
    {
        slug: '6th-challenge-voting-facebook-group-message',
        title: '6th challenge voting',
        courseDayIndex: 0,
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
        courseDayIndex: 0,
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
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Közben még 3 napod van feltölteni a hosszú záridős fotódat itt: {uploadUrl} – ne felejtsd el! 🕐`,
    },
    {
        slug: '8th-challenge-email-current-students-message',
        title: '8th challenge: Still life',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Nyolcadik hét: csendélet',
        contentType: 'text/html',
        content: ``, // TODO
    },
    {
        slug: '8th-challenge-facebook-group-message',
        title: '8th challenge: Still life',
        courseDayIndex: 0,
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
        courseDayIndex: 0,
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
        courseDayIndex: 0,
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
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] Kilencedik hét: portréfotózás',
        contentType: 'text/html',
        content: ``, // TODO
    },
    {
        slug: '9th-challenge-facebook-group-message',
        title: '9th challenge: Portrait',
        courseDayIndex: 0,
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
        courseDayIndex: 0,
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
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Ne feledd, még 2 napod van feltölteni a legjobb portrédat itt: {uploadUrl} 😊`,
    },
    {
        slug: '10th-challenge-email-current-students-message',
        title: '10th challenge: Events',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] 10. hét: eseményfotózás',
        contentType: 'text/html',
        content: ``, // TODO
    },
    {
        slug: '10th-challenge-facebook-group-message',
        title: '10th challenge: Events',
        courseDayIndex: 0,
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
        courseDayIndex: 0,
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
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Szuper időnk van. 😊 Ne felejtsétek holnap estig elkészíteni és beküldeni a remek eseményfotótokat. Ide ni: {uploadUrl} :)`,
    },
    {
        slug: '11th-challenge-email-current-students-message',
        title: '11th challenge: Self portrait',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] 11. hét: túl a selfie-n',
        contentType: 'text/html',
        content: ``, // TODO
    },
    {
        slug: '11th-challenge-facebook-group-message',
        title: '11th challenge: Self portrait',
        courseDayIndex: 0,
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
        courseDayIndex: 0,
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
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Még két napod van feltölteni az önarcképedet itt: {uploadUrl} – ne felejtsd el, ez az utolsó előtti hét! 😊`,
    },
    {
        slug: '12th-challenge-email-current-students-message',
        title: '12th challenge: Freestyle',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.currentStudents,
        locale: 'hu-HU',
        subject: '[Photato] 12., utolsó hét: freestyle – fotózz szabadon!',
        contentType: 'text/html',
        content: ``, // TODO
    },
    {
        slug: '12th-challenge-facebook-group-message',
        title: '12th challenge: Freestyle',
        courseDayIndex: 0,
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
        courseDayIndex: 0,
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
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Még hátra van a hétvége, hogy beküldd az utolsó heti fotódat: {uploadUrl} Freestyle fotó, azaz bármit szabad! Ha tetszett a kurzus, küldj be egy képet! 😊`,
    },
    {
        slug: 'exhibition-facebook-group-message',
        title: 'Exhibition (Facebook event)',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `
[Title: Photato fotókiállítás / photo exhibition]
[Keywords: Keywords: fotó tanfolyam kiállítás fotókiállítás krumpli photo exhibition course potato]
[Watch out for TODOs!]
A Photato első kurzusának záróakkordjaként csütörtökön este kiállítjuk a legjobb képeket a Szimplában. A nyertes képek fotósai értékes nyereményekben részesülnek! Díjátadó 20:00-kor! Jelezzetek vissza, hogy tudjuk, mennyien leszünk! :) Csütörtökön találkozunk! 🥔

Same in English:

We've just finished the latest course of “Photato: 12 weeks, 12 shots”. The best photos will be displayed Thursday night in Szimpla, and you can meet the artists whose shots will be awarded with valuable potatoes. Indicate if you're coming! See you on Thursday! :)`,
    },
    {
        slug: '12th-challenge-voting-facebook-group-message',
        title: '12th challenge voting',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `[Galéria címe: "12. hét: freestyle"]
Megérkeztek az utolsó heti képek! Gyorsan szavazzatok rájuk, mert holnap délután 2-kor lezárjuk a szavazást, az akkori sorrend alapján nyer a legtöbb lájkot kapott kép. Csütörtökön pedig találkozunk a Szimplában (ld. a Facebook eseményt)! 😊`, // TODO: We'll need a link in this message once we have the galleries in the website.
    },
    {
        slug: 'exhibition-reminder-facebook-group-message',
        title: 'Event reminder',
        courseDayIndex: 0,
        channel: channels.facebook,
        audience: facebookAudiences.group,
        locale: 'hu-HU',
        contentType: 'text/plain',
        content: `Hamarosan találkozunk, és kihirdetjük a nyerteseket, már nagyon izgatottak vagyunk! 🥔
18:00-kor várunk Titeket ezen a Zoom linken:
https://zoom.us/j/9995559876?pwd=ZW5tSzBjUERzNktyalhSRk1COWFFQT09 

A Zoom használható laptopról, tabletről és mobilról is. Tudjátok telepíteni az alkalmazást, ezt automatikusan felajánlja, amikor rákattintotok a fenti linkre, válasszátok a ’dowload and run Zoom’ lehetőséget. Választhatjátok azt is, hogy a böngészőből csatlakoztok, ehhez kattintsatok arra, hogy ’join from your browser’. Ha nehézségetek lenne a belépéssel, írjatok és segítünk! :)
`,
    },
    {
        slug: 'exhibition-invitation-email-winners-message',
        title: 'Exhibition for winners',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.winners,
        locale: 'hu-HU',
        subject: '[Photato] Eredményhirdetés',
        contentType: 'text/html',
        content: `Szia!

Baráti tipp: Ha Te lennék, én benéznék a csütörtök esti eredményhirdetésre, hátha nyertél valamit! 😉

Az infók:

A Photato harmadik kurzusának záróakkordjaként csütörtökön este kiállítjuk a legjobb képeket a virtuális térben, amit összekötünk egy pogácsázással-borozással ZOOM-on! Természetesen tea, süti is választható, sőt, mivel mindenki otthonról fog csatlakozni, azzal készülsz, amivel szeretnél! :)

A nyertes képek fotósai értékes nyereményekben részesülnek! Díjátadó 18:00-kor! A ZOOM linket röviddel az esemény előtt küldjünk, ahol tudsz majd kapcsolódni.

Csütörtökön találkozunk! 🥔

Üdv,
A Photato csapata
`,
    },
    {
        slug: 'farewell-email-winners-message',
        title: 'Farewell',
        courseDayIndex: 0,
        channel: channels.email,
        audience: emailAudiences.winners,
        locale: 'hu-HU',
        subject: '[Photato] Viszlát, és köszi a fotókat',
        contentType: 'text/html',
        content: `<p>Kedves {firstName},</p>
<p>Ez az utolsó levél, amit a mostani Photato kurzussal kapcsolatban küldünk neked.</p>
<p>Köszönjük, hogy velünk tartottál. 😊</p>
<p>Gratulálunk a nyerteseknek! 🏆 <a href="{TODO}">A legjobbnak ítélt 12 fotót itt<a/> tudod megnézni.</p>
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
<li>❓ <strong>Válaszolj pár kérdésünkre:</strong> Készítettünk egy 3 perces <a href="http://bit.ly/2D0ltFJ">kurzus végi kérdőívet</a>. Csak 9 kérdésből áll, és mind opcionális. Légyszi töltsd ki, rengeteget segítesz a visszajelzéseddel, még akkor is, ha egyébként kevésbé voltál aktív a tanfolyamon.</li>
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
}