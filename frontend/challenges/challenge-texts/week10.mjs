export async function getMaterial({formattedDeadline, createPhotoUploadLink, createFullWidthImage}) {
    return `<p><strong>Röviden:</strong></p>
<p>A 10. héten egy <strong>eseményfotót</strong> várunk tőled, ${createPhotoUploadLink('itt tudod feltölteni')}.</p>
<p><strong>Hosszabban:</strong></p>
<p>${createFullWidthImage('concert.jpg', 'Koncert Buffalo WY')}</p>
<p>Megint egy könnyedebb, de sokakat érintő témával jövünk: csoportos események fényképezésével. Legyen az buli, családi összejövetel, esküvő vagy koncert, valószínűleg sokan fognak kattogtatni közben a telefonjukkal, köztük talán te is. Megpróbálunk segíteni, hogy minél jobb fotókat lőj az ilyen helyzetekben. A legjobb képed ${formattedDeadline}-ig, ${createPhotoUploadLink('itt tudod majd feltölteni')}.</p>
<p>Eseményt fotózni lehet résztvevőként, vagy meghívott fotósként. A két felállás elég különböző; igyekeztünk olyan tippeket válogatni, amik mindkét esetben hasznodra válnak. Ők azok:</p>
<ol>
    <li><strong>Ismerd a helyszínt és a programot.</strong> Hasznos, ha az esemény előtt/elején be tudod járni a teljes helyszínt. Képzeld el előre, mi fog történni, hová kell állnod, hogy elkapd a jelentős pillanatokat. Légy készenlétben.</li>
    <li><strong>Használd az automatikát.</strong> Gyakran spontán alakul ki valami izgalmas fotótéma, ezért érdemes automata beállítást használni: fényképezőgépen “Auto” vagy “P” üzemmódot, vagy mobilt. A “P” mód előnye, hogy be tudod állítani az ISO értéket. Kültéren, jó fénynél érdemes a legalacsonyabbra állítani. Sötét helyen akár a legmagasabb értékekre is szükség lehet, ha nem annyira jó az objektíved.</li>
    <li><strong>Légy ninja.</strong> Maradj észrevétlen, figyelj, és csapj le a megfelelő időpontban. Ha meghívott, pl. esküvői fotós vagy, öltözz az alkalomnak megfelelően, hogy ne lógj ki a résztvevők közül.</li>
    <li><strong>Vagy ne légy ninja.</strong> Főleg, ha te magad is részt veszel az eseményen. Beszélgess, instruálj, ismerd meg, mit éreznek a többiek, hogy vissza tudd adni a hangulatot a fotókon. A természetes jókedv mindig jól néz ki a képeken: ha meg szeretnéd mosolyogtatni a modelljeid, jól jöhet pár kiegészítő: vicces kalap, álbajusz, repülő uborka stb.</li>
    <li><strong>Buliban kapcsold ki a vakut.</strong> De hát akkor bemozdul a kép! Két jó megoldás van: 1. egy nagy fényerejű objektív. Egy F/1,8-as rekeszű, 50mm-es gyújtótávolságú, fix objektív pl. ideális a legtöbb célra. Az ISO érték max. 1600-3200 legyen, hogy ne legyen szemcsés a kép. Nem baj, ha a gép szerint alulexponált a kép, ez azért van, mert sötét a kép nagy része. 2. használj külső vakut, vagy egy (másik) mobilt a megvilágításhoz. Külső vakun használj ún. diffúzort: ez egy kis kupak vagy lap, ami szórja a fényt, így nem keletkezik éles árnyék.</li>
</ol>
<p>Ötletek, variációk:</p>
<ul>
    <li><strong>Apró interakciók.</strong> Koccintás, ölelés, kézfogás, összenézés.</li>
    <li><strong>Beszédes csendéletek.</strong> Pohártornyok, kábelhalmok, székek egymás mellett, egy csokor a széken / egy csokor az árokban.</li>
    <li><strong>Exponálj hosszan, vakuval.</strong> Ezt viszonylag sötét helyen tudod megcsinálni. Állítsd a géped manuális (“M”) módba és állítsd hosszúra az exponálási időt, de kapcsold be a vakut is. Így kaphatsz elmosódott, de ugyanakkor éles képeket, pl. <a href="/challenges/linked-images/long-exposure-with-flash.jpg">mint ez</a>.</li>
    <li><strong>Keress furcsa szögeket.</strong> Felállhatsz valahová magasra (létra, mászóka, teherautó-plató) vagy lefekhetsz a földre. A magas pontról fotózás járulékos előnye, hogy ha a fotózott emberek mind fölfelé, rád néznek, senkinek nem lesz tokája a képen.</li>
</ul>
<p>További tippek:</p>
<ul>
    <li><a href="http://blog.fotosarok.hu/2013/04/hogyan-fotozzunk-buliban/">Hogyan fotózzunk buliban?</a> – 7+1 tipp a FotóSarok Blogról.</li>
    <li><a href="http://www.elkapottpillanatok.hu/tippek/fotozas-szuletesnapi-zsuron">Fotózás születésnapi zsúron</a> – 11 tipp, ötlet egy profi fotóstól.</li>
    <li><a href="https://hvg.hu/tudomany/20071221_karacsonyifoto">Tippek a karácsonyi fotózáshoz</a> – Pont aktuális – ja nem. 😀 De a cikkben leírt 14 tipp jól alkalmazható bármilyen bulira, családi eseményre.</li>
</ul>
<p>Inspiráció: <a href="https://www.pexels.com/search/event/">Pexels</a> | Pinterest: <a href="https://hu.pinterest.com/search/pins/?q=party%20photography">buli</a>, <a href="https://hu.pinterest.com/search/pins/?q=wedding%20photography">esküvő</a>, <a href="https://hu.pinterest.com/search/pins/?q=concert%20photography">koncert</a></p>
<p>Ha még nem küldted be a múlt heti (portré) képedet, ma éjfélig még azt is ${createPhotoUploadLink('megteheted')}. 🕚</p>
<p>Az eseményfotókat pedig ${createPhotoUploadLink('itt várjuk')}!</p>
<p>Jó fotózást,</p>
<p>--<br />
    a Photato csapata</p>`;
}