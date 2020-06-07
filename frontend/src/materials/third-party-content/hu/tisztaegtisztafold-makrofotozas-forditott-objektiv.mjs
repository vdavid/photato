import React from '../../../web_modules/react.js';
import EnlargeableFigure from '../../components/EnlargeableFigure.mjs';
import ExternalLink from '../../components/ExternalLink.mjs';

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {ArticleMetadata}
 */
export function getMetadata() {
    // noinspection SpellCheckingInspection (It's in Hungarian.)
    return {
        slug: 'tisztaegtisztafold-makrofotozas-forditott-objektiv',
        title: 'A világ apró csodái avagy makrofotózás fordított objektívvel',
        author: 'Csíkos István',
        publishDate: new Date('2017-07-27'),
        publisherName: 'Tiszta ég, tiszta föld',
        originalUrl: 'https://tisztaegtisztafold.hu/makrofotozas-forditott-objektiv/',
        isOriginalUrlBroken: false,
    };
}

// noinspection JSUnusedGlobalSymbols (This file is loaded dynamically.)
/**
 * @returns {React.ReactElement}
 */
export default function Article() {
    // noinspection SpellCheckingInspection,HtmlUnknownAnchorTarget (It's in Hungarian.)
    return <>
        <p className="note">
            <strong>Csíkos István</strong> fotóival először a facebookon találkoztam. Hihetetlen világot tárt a szemem elé, és a képekhez fűzött szövegeiből sugárzott a természet, az Élet szeretete. Úgy éreztem, Ő az az ember, akinek munkássága és szellemisége megérdemli a nagyobb figyelmet. Így megkértem, hogy írjon az általa használt technikáról és szemléletéről a blogon. Fogadd szeretettel. – Mayer Miklós
        </p>
        <p>Üdvözlök mindenkit, a nevem Csíkos István! <ExternalLink href="http://www.csikosistvan.com/">Makrofotózással foglalkozom szabadidőmben</ExternalLink>, méghozzá egy viszonylag kevésbé elterjedt módjával, a fordított objektíves technikával. Erről fogok most leírni pár gondolatot.
        </p>
        <EnlargeableFigure fileName="makrofotozas-forditott-objektivvel.jpg" altText="makrofotozas forditott objektivvel" caption="Makrófotózás fordított objektivvel"/>

        <h2>Alapok</h2>
        <p>Nagyjából 6 évvel ezelőtt kezdtem el fotózni, és az elejétől fogva a makró világ szippantott be leginkább. A vágy hogy felfedezzem ezt a körülöttünk lévő, mégis láthatatlannak tűnő világot olyan erős volt, hogy minden egyes fotózás után azon gondolkodtam hogy tudnék még mélyebbre jutni.</p>
        <p>Eleinte sok mindent kipróbáltam, egész drága objektívekre is összekapartam a rávalót (használtam Canon Ef 100mm f2.8L macro és végül Canon MP-E 65 obikat is), szereztem körvakut, és egy Canon MT 24-EX makrovakut is.</p>
        <p>Annak ellenére hogy a Canon MP-E65 objektívje gyakorlatilag csak makrofényképezésre használható, és tényleg elképesztő lencse, valahogy mégsem éreztem magaménak ezt az utat.</p>
        <p>Hihetetlen leképzés (1:1 és 5:1 között !!!), remek felépítés és optikai teljesítmény, és mégis idegennek éreztem az egészet. Ez nem azt jelenti hogy ne lenne más számára közel tökéletes lencse, de nekem másra volt szükségem. És ekkor láttam először <ExternalLink href="http://thomasshahan.com/#photos">Thomas Shahan képeit</ExternalLink> (2012 környékén).
        </p>

        <h2>Megérkeztem</h2>
        <p>Thomas fotóit látva tudtam, hogy mire van szükségem. Ez olyas fajta tudás, amit nem az elméjével tud az ember. Ahhoz hasonló, mikor feljössz a víz alól és levegőhöz jutsz. Nem kell gondolkodnod rajta, hogy ez jó-e neked vagy sem….</p>
        <p>A természet szeretete mindig is jelen volt az életemben, már kiskoromtól kezdve. Így nem esett nehezemre egy-egy fotó után nekiülni és a neten keresgetni, hogy vajon milyen faj lehet az aktuális modell. Kíváncsian olvasgattam, hogy ezelőtt miket jegyeztek le egy adott fajról, és nekem mik a tapasztalataim.</p>
        <p>A mai kornak meg van az az előnye hogy ha van internet hozzáférésed, akkor gyakorlatilag bármit megtudhatsz, megtanulhatsz amit csak akarsz.</p>

        <h2>Tervezés</h2>
        <p>Utána olvastam Thomas Shahan mit hogy csinál, és ekkor találkoztam először a fordított objektíves makrofotózás világával. Elsőre lenyűgözött már maga az ötlet is, hogy egy “komoly” makrófelszerelés árának töredékéből ilyen minőséget lehet kihozni. Arról nem is beszélve, hogy véleményem szerint lenyűgöző a képi világa ennek a módszernek. Ez persze szubjektív, de az én esetemben ez szerelem volt első látásra.</p>
        <p>Egy kis kedvcsinálónak itt egy ilyen módszerrel készült kép:</p>
        <EnlargeableFigure fileName="aeurillus.jpg" altText="ugropok makrofoto" caption="Az egyik legszebb Magyarországi faj hímje (Aelurillus v-insignitus)"/>

        <h2>Tartalom</h2>
        <ul>
            <li>
                <a href="#Epitkezes">Építkezés</a>
            </li>
            <li>
                <a href="#Felepites">Felépítés</a>
            </li>
            <li>
                <a href="#Mukodes">Működés</a>
            </li>
            <li>
                <a href="#Objektivek">Objektívek</a>
            </li>
            <li>
                <a href="#Expozicio_es_vaku_beallitasa">Expozíció és vaku beállítása</a>
            </li>
            <li>
                <a href="#Hatranyok">Hátrányok</a>
            </li>
            <li>
                <a href="#Fokuszeltolas">Fókuszeltolás</a>
                <ul>
                    <li>
                        <a href="#Pelda_fokusz_eltolasra">Példa fókusz eltolásra</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="#A_gyakorlatban">A gyakorlatban</a>
            </li>
            <li>
                <a href="#Ennyit_a_geprol_beszeljunk_a_lenyegrol8230">Ennyit a gépről, beszéljünk a lényegről…</a>
                <ul>
                    <li>
                        <a href="#Aprocska_vilag">Aprócska világ</a>
                    </li>
                    <li>
                        <a href="#Az_elet">Az élet</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="#Jo_tanacs">Jó tanács</a>
            </li>
            <li>
                <a href="#Egyeb_forrasok_forditott_objektives_makrofotozas_temaban">Egyéb források fordított objektíves makrófotózás témában</a>
            </li>
        </ul>

        <h2 id="Epitkezes">Építkezés</h2>
        <p>A módszer sokkal egyszerűbb, mint az emberek gondolják… Inkább azért lengi át egyfajta titokzatosság ezt a technikát mert kevesen használják, és még kevesebben írnak róla.</p>
        <p>Amire szükségünk lesz ehhez a módszerhez:</p>
        <ul>
            <li>Egy digitális fényképezőgép</li>
            <li>Egy fordítógyűrű: ez egy pár ezer forintos fém gyűrű, az egyik fele menetes és az objektív szűrőmenetébe lehet becsavarni, a másik oldala pedig az adott gép bajonettjével rendelkezik</li>
            <li>Egy 50mm vagy ennél nagyobb látószögű objektív (bár 28 mm-nél nagyobb látószögű objektívvel még nem próbálkoztam): Én régi manuális Canon fd objektíveket használok mert olcsó áruk ellenére tökéletesek a fordított objektíves makrózáshoz</li>
            <li>Egy közgyűrűsor, hogy nagyobb leképzést tudjunk elérni (így még kisebb dolgokat tudunk lefotózni)</li>
            <li>Egy külső vaku, mert ennél a módszernél kicsi a tárgytávolság, így a beépített vaku fényét leárnyékolja a közgyűrű és az objektív.</li>
            <li>Egy fénylágyító a vakura, hogy szép szórt fényt produkáljon</li>
            <li>Egy L alakú vakutartó, hogy a vaku az objektív elé villanjon</li>
            <li>Egy vakukábel, hogy összekössük a gépet a vakuval</li>
            <li>Egy vakutartó gömbcsukló, hogy a vakunkat könnyen tudjuk mozgatni</li>
        </ul>

        <h2 id="Felepites">Felépítés</h2>
        <p>A gépre először a közgyűrű sor jön (minél hosszabb a közgyűrű annál kisebb lényeket tudunk fotózni, de annál kevesebb fénnyel tudunk gazdálkodni),</p>
        <p>erre jön a fordítógyűrű, erre pedig az objektív fordítva feltéve, a szűrőmenetével felrakva a gyűrűre,</p>
        <p>és már csak a vakut kell feltennünk a gépre, az L alakú vakutartóval.</p>
        <p>Az így kapott gép nem büszkélkedhet a szépségével, vagy a kecsességével, de olyan mélyre lát amit csak remélni mertünk….</p>
        <p>A végeredmény valahogy így néz majd ki…</p>

        <EnlargeableFigure fileName="DSC1003.jpg" altText="makrofotozas fenykepezogep"/>
        <p>Szépnek nem szép, de hatékony…</p>
        <h2 id="Mukodes">Működés</h2>
        <p>Kaptunk tehát egy gépet ami 1:1 leképzésnél nagyobb leképzésre is alkalmas. A leképzés attól függ, hogy</p>
        <ol>
            <li>milyen objektívet fordítunk a gép elé ( minél nagyobb látószögű objektívet fordítunk annál nagyobb leképzést kapunk, annál kisebb dolgokat tudunk fotózni)</li>
            <li>mennyi közgyűrűt teszünk a gép és a fordítógyűrű közé, minél több a közgyűrű , annál nagyobb lesz a leképzés</li>
        </ol>

        <EnlargeableFigure fileName="Holopogon.jpg" altText="makrofotozas rablolegy" caption="Holopogon rablólégy fordított 50mm + közgyűrű segítségével"/>
        <EnlargeableFigure fileName="IGP3687.jpg" altText="rablolegy makrofotozas" caption="Egy Holopogon rablólégy mérete kis leképzéssel"/>
        <p>Én 50mm és 28 mm objektíveket használok fordítva, itt van egy egy példa mind a kettőre, ugyan azon ugrópókfajnál..</p>
        <EnlargeableFigure fileName="munka2.jpg" altText="munka2" caption="Marpissa muscosa 50mm fordított objektívvel"/>
        <EnlargeableFigure fileName="kell_1.jpg" altText="kell_1" caption="Marpissa muscosa 28mm fordított objektívvel"/>

        <h2 id="Objektivek">Objektívek</h2>
        <p>Én régi manuális Canon obikat fordítok, bár használtam már Pentax smc 50mm f1.7 manuális obit is.</p>
        <p>Ezek előnye, hogy olcsón hozzá lehet jutni hibátlan lencsékhez, és ezek még egyszerű de jó minőségű lencsék voltak.</p>
        <p>A Pentax szűrőmenete valahogy kiszakadt az objektív saját súlyától ( hiszen ilyenkor a szűrőmenet tartja az objektívet), ami lehet véletlen is, de ezután maradtam a strapabíróbb Canon fd objektíveknél.</p>
        <p>Ezek hátránya, hogy a blendét elég nehéz állítani, van két fém tüske a bajonetten, amit ha egyszerre benyomunk akkor tudjuk állítani a rekeszt. Viszont mivel nagyjából f11-és f14 környékén adják a legjobb képminőség-mélységélesség párost, így nem igen kell őket állítgatni.</p>
        <p>Úgy gondolom, hogy 50mm és 28 mm között bármilyen objektívet jó eredménnyel fordíthatunk.</p>

        <h2 id="Expozicio_es_vaku_beallitasa">Expozíció és vaku beállítása</h2>
        <p>Külső vakunak egy Metz 58 AF 1 vakut használok, manuális üzemmódban, mindig az aktuális helyzethez igazítva a vaku fényerejét.</p>
        <p>A gép szintén manuális üzemmódba van állítva, ebben az esetben ugye csak a záridővel kell foglalkoznunk, hiszen az ISO érték nem is kérdés, hogy 80-vagy 100 hiszen lesz elegendő fényünk az exponáláshoz (hála a külső vakunknak).</p>
        <p>A témához képest óriási vaku világítja be a terepet, ami nekünk kicsinek tűnik, alanyunkhoz képest viszont hatalmas tér.</p>
        <p>A fénylágyítónak köszönhetően kellemes szórt fényt kapunk, és a háttér sem bukik feketébe (mivel a vaku azt is bevilágítja), ami szerintem nagyon sokat ad a képhez.</p>
        <p>Itt megjegyezném, hogy ezeknél a képeknél lehetőség nyílik a háttér színének befolyásolására: gyakorlatilag elég egy levelet a téma mögé helyeznünk óvatosan, és máris kellemes zöld hátteret kapunk.</p>

        <h2 id="Hatranyok">Hátrányok</h2>
        <p>Ez a módszer rengeteg fényvesztéssel jár, többek között a közgyűrű használata miatt. Ezért vaku nélkül nem lehet használható képeket csinálni, legalább is ami az állatvilágot illeti, hiszen ők nem állnak egy helyben, követnünk kell őket, így az állvány használata is teljességgel kizárt.</p>
        <p>Ekkora leképzésnél még az a bemozdulás is jelentős, amit a vér pulzálása okoz a kezünkben. Emiatt minimum 1/80-as záridőt kell használnunk, különben bemozdult képeket kapunk. Ezt csak vaku segítségével tudjuk elérni.</p>
        <p>A vaku azonban csak az elkészült képen segít, azon viszont nem amit a keresőben látunk.</p>
        <p>EZ A MÓDSZER NAGYON SÖTÉT!!! A sötétség és a hatalmas nagyítás miatt sokszor már a témát megtalálni is kihívás, és ezután még komponálnunk kell, és elkészítenünk a képet. Azt mondom, hogy a 28mm-es objektív csak minimális közgyűrűvel használható annyira sötét…</p>
        <p>Ráadásnak még ott van az a tény is, hogy a vakulágyító pont a téma felett helyezkedik el, így még szikrázó napsütésben is árnyékban lesz a témánk.</p>
        <p>Ennek van előnye is, mert csináltam már olyan képet ahol a nap besütött a lágyító alá, de ez nagyon csúnya becsillanásokat okozott a pók testén.</p>
        <p>Vaku nélkül olyan hosszú záridőt kéne alkalmaznunk, hogy lehetetlen lenne kézben kitartani (még a legstabilabb fotósoknak is ver a szívük, és ennél a technikánál ez épp elég, hogy homályos képeket készítsünk), ráadásul valószínűleg maga az állat is hazamenne unalmában mire kiexponálnánk…</p>
        <p>És itt előjön még egy nehézség.</p>
        <p>A hatalmas nagyításnak megvan az ára, mégpedig a nagyon kis mélységélesség. Néha csupán a milliméter tört része az éles tartomány. Emiatt előfordul, hogy egy kép elkészítése során azt látjuk, hogy ugyan az élesség a megfelelő helyre került, annyira kicsi az éles rész, hogy elégtelennek érezzük….</p>
        <p>Ennél a képnél például a fókusz helyesen a szemre került, azonban a mélységélesség annyira kicsi, hogy a kép élvezhetetlen:</p>
        <EnlargeableFigure fileName="makrofotozas-melysegelesseg.jpg" altText="makrofotozas-melysegelesseg"/>

        <h2 id="Fokuszeltolas">Fókuszeltolás</h2>
        <p>Ekkor jön be a képbe a fókuszeltolás (focus stacking) nevű technika.</p>
        <p>Ennek lényege, hogy több képet lövünk egymás után, ugyanarról a témáról, de minden képen kicsit hátrébb és hátrébb helyezzük a fókuszt.</p>
        <p>Az így elkészült képeket ezután egy programmal (én Photoshop-ot használok) összemásoljuk úgy, hogy egy képre kerüljön az összes, külön-külön elkészített éles rész.</p>
        <p>Így végül kapunk egy gyönyörűen mosott hátterű, de mégis tűéles makrofotót. Nem mindenki szereti ezt a képi világot, előfordul, hogy embereket zavar a kis mélységélesség.</p>
        <p>Én személy szerint nagyon szeretem, remek eszköz arra, hogy az ember kiemelje a témát.</p>
        <p>Ehhez viszont nem elég 1 jó képet elkészítenünk, néha 3-4 kép is szükséges a sikerhez….</p>
        <h3 id="Pelda_fokusz_eltolasra">Példa fókusz eltolásra</h3>
        <p>Egy példa egy 4 képes focus stacking-re.</p>
        <p>Az első 4 kép a rész fókuszokat mutatja, az eredeti képeket, az utolsó a már összemásolt végleges képet.</p>
        <p>Nem tökéletes, mert a szem alatt kimaradt egy réteg, így az ott látható szőr nem éles, de már majdnem tökéletes.</p>
        <div className="figures">
            <EnlargeableFigure fileName="IGP6563.jpg" altText="makrofotozás ugropok1"/>
            <EnlargeableFigure fileName="IGP6568.jpg" altText="makrofotozas ugropok 4"/>
            <EnlargeableFigure fileName="IGP6567.jpg" altText="makrofotozas ugtopok 3"/>
            <EnlargeableFigure fileName="IGP6565.jpg" altText="makrofotozás ugropok2"/>
        </div>
        <p>Az összerakott végső kép:</p>
        <EnlargeableFigure fileName="makrofotozas-focus-stacking-vegeredmeny.jpg" altText="makrófotózás focus stacking végeredmény"/>

        <h2 id="A_gyakorlatban">A gyakorlatban</h2>
        <p>A gyakorlatban az első kérdés ami felmerül, hogy hogyan fókuszáljunk.</p>
        <p>Ez is egy nehéz ügy.</p>
        <p>Én a gépet mozgatom előre-hátra, hogy a fókusz előrébb vagy hátrébb kerüljön.</p>
        <p>Ami problémát okoz, hogy gyakorlatilag tized millimétereket szabad csak mozognunk. Bonyolultnak hangzik? Az is, sőt inkább lehetetlen.</p>
        <p>Azonban ha több képet lövünk, mint amire szükségünk lesz a megfelelő mélységélességhez, van rá esélyünk, hogy a hibás képek mellett meglesznek azok is amik pont beleillenek a fókuszsorozatba.</p>
        <p>A legtöbb esetben 2-3 képpel már jók lehetünk, szóval van rá esély, hogy sikerrel járjunk.</p>
        <p>De nem titok, hogy sok esetben sajnos nem járunk sikerrel. Ez benne van a pakliban….</p>
        <p>Pont tegnap számolgattam egy beszélgetés kapcsán, hogy az elmúlt 5 év alatt kb. 124 fordított obis makrót sikerült úgy meglőnöm, hogy nézhető legyen.</p>
        <p>Nem fergeteges képek, csak jó helyen van a fókusz, és nem teljesen zavaró a háttér. Ebből van kb. 20 olyan kép, amit nagyon szeretek és szerintem jól is sikerült (talán némelyik fergeteges 🙂 ).</p>
        <p>Tehát évente csináltam 4 olyan képet, amivel elégedett vagyok. Nem tűnik túl soknak. Ezért nem hiszik el sokan, hogy lehet kézből stacket lőni, meg hogy élő rovarokat fotózom.</p>
        <p>Csak azt nem tudják, hogy 5 év alatt kidobtam kb. 6000 képet, és eltettem 124-et.</p>

        <h2 id="Ennyit_a_geprol_beszeljunk_a_lenyegrol8230">Ennyit a gépről, beszéljünk a lényegről…</h2>
        <p>Az első időszak nagyon nehéz ezzel a technikával, rengeteg sikertelen próbálkozásunk lesz, aminek aránya a későbbiekben sem javul majd hihetetlen módon.</p>
        <p>Ennek ellenére megéri kitanulni ezt az utat. Egy olyan világ(rész) tárul szemünk elé, ami mindig is a lábunk előtt hevert, mégsem került a látóterünkbe.</p>

        <EnlargeableFigure fileName="szita.jpg" altText="makrofotozas szitakoto" caption="Egy kis szitakötő portréja"/>

        <h3 id="Aprocska_vilag">Aprócska világ</h3>
        <p>Sokan félnek a rovaroktól, egyenesen rettegnek a pókoktól, gyűlölik a böglyöket stb.</p>
        <p>De az igazság közelebb áll ahhoz, hogy nem ezektől az állatoktól félnek, csak a róluk kialakított, elképzelt képektől.</p>
        <p>Ha az emberek valóban találkoznának ezekkel az állatokkal, és valós kapcsolat jönne létre közöttük, rájönnének, hogy eddig csak egy elképzeléstől rettegtek.</p>
        <p>Gyakorlatilag az összes ugrópók már csak méretéből adódóan is teljesen veszélytelen az emberre. Arról nem is beszélve, hogy sokkal kevésbé agresszívak, mint mi emberek vagyunk.</p>
        <p>Élik az életüket, vadásznak, ha élelemre van szükségük. De minden esetben elkerülik az emberrel való találkozást, hiszen minden ilyen potenciális életveszély számukra.</p>
        <p>Ha kicsit is hajlandóak vagyunk a félelmeink mögé nézni, rájövünk, hogy ezek az állatok sosem akartak nekünk ártani.</p>
        <p>Még a böglyök és szúnyogok is csak az utódnemzés miatt szívnak vért, nem gonoszságból, csupán azért, hogy beteljesítsék életük talán legfontosabb, de mindenképp legmélyebbre kódolt feladatát.</p>
        <EnlargeableFigure fileName="bögi.jpg" altText="makrofotozas bogoly" caption="Bögöly makró. A Balaton és környéke tökéletes élőhely nekik"/>
        <p>Amikor rovarokat fotózunk, tisztában kell lennünk vele, hogy vigyáznunk kell rájuk.</p>
        <p>Nekünk ez csak egy fotózás, de egy meggondolatlan mozdulat nekik az életükbe kerülhet. Ezért mindent meg kell tennünk, hogy épségben és sértetlenül éljék át a fotózást.</p>
        <p>Néha amikor új fajt találok, vagy kint képtelen vagyok lefotózni őket, előfordul hogy hazahozom őket és itt fotózom le. Majd ha megvagyunk, visszaviszem őket oda ahol találkoztunk és útjukra engedem őket.</p>
        <p>Sokat gondolkodtam rajta, hogy ez nekik mekkora trauma lehet, de a tapasztalatok alapján úgy tűnik őket nem annyira viseli meg ez a dolog.</p>
        <p>A legtöbb ugró amikor visszavittem őket, egyből elindul felfedezni, nemegyszer láttam, hogy az elengedés után pár percre már vadásztak mintha mi sem történt volna.</p>
        <p>Úgy tűnik ők kicsit kevésbé problémáznak azon ami történik, egyszerűen csak megélik az életet.</p>
        <p>Repülő rovarok esetében erre nincs mód, ott minden esetben marad a szabadtéri fotózás.</p>
        <p>Persze nem csak állatokat lehet felfedezni a makrófotózással, rengeteg érdekes növény, vagy tárgy részlet van amit szabad szemmel sosem látnánk…</p>
        <p>Ugrókkal én leggyakrabban, füves, bokros területeken találkoztam, magasabban fekvő helyeken egyáltalán nem , sűrű erdős részeken szintén nem nagyon.</p>
        <p>Késő tavasztól, késő őszig aktívak többnyire, szeretik a meleg időt. Némelyik faj pl. Aelurillus v-insignitus kimondottan a homokos talajt szereti.</p>

        <h3 id="Az_elet">Az élet</h3>
        <p>Mi emberek gyakran elfelejtjük, hogy mi is az élet.</p>
        <p>Gyakran összekeverjük a saját élettörténetünkkel, és kizárunk minden mást. Ismét kialakítunk egy elképzelést az életről, ahelyett, hogy valóban odafigyelnénk rá.</p>
        <p>Ezek az apró állatok (ahogy minden más élőlény is), velünk emberekkel együtt, szintén az ÉLETBEN VANNAK.</p>
        <p>Ők is, mint mi, megtestesítik az élet csodáját. Már többször bebizonyítottuk mi emberek, hogy semmit sem tudunk az életről (például elég azt mondanunk egy élőlényre hogy “haszonállat” és máris elvettük minden élethez való jogát, illetve megfosztottuk minden lehetőségétől, gyakorlatilag tárgyként kezelhetjük büntetlenül, legálisan ).</p>
        <p>Amikor ezeket az apró csodákat fotózom, valahogy mindig teljesnek érzem a dolgokat. Ez sokszor nem tudatosul fotózás közben, és gyakran előfordult, hogy nem kellő tudatossággal indultam neki a fotózásnak. Ilyenkor mindig idegesség, és sikertelenség lett a vége.</p>
        <p>De valahogy mindig érdekes és friss érzésem van, akárhányszor tavasszal ismét nekiindulok rovarokat fotózni.</p>
        <EnlargeableFigure fileName="végső.jpg" altText="pok makrofotozas"/>

        <h2 id="Jo_tanacs">Jó tanács</h2>
        <p>Ha valaki a tanácsomat kérné, mert most szeretne belevágni a fordított objektíves makrófotózásba, azt hiszem három igazán fontos dolgot tanácsolnék neki,</p>
        <ol>
            <li>Élvezd a fotózást, élvezd az utat és ne a cél és a siker lebegjen a szemeid előtt. Persze fontos hogy legyen sikerélményünk, és fontosak a pozitív visszajelzések, de ha magát a fotózást a jelen pillanatban nem élvezed, akkor szinte biztosan kudarcra van ítélve a munkád.</li>
            <li>Ne add fel, mindegy hány rossz képet lősz egy nap. Minden rossz kép közelebb visz a jó képekhez, mert tanulsz belőlük, egyre jobban ráérzel, hogy mit hogyan csinálj. A végén már nem gondolkodsz rajta, csak megcsinálod.</li>
            <li>Lásd meg az életet abban, akit fotózol (igen szándékosan írtam valakit, még rovarok esetében is, mert nem szeretem őket tárgyként kezelni), és akkor kialakul egy láthatatlan kapcsolat. Az állatok nem felejtették ezt el, csak mi emberek….</li>
        </ol>

        <h2>….talán itt az ideje emlékeznünk!</h2>
        <p>Köszönöm a lehetőséget a vendégírásra, remélem néhány ember kedvet kap a makrofotózáshoz, és remek képek születnek majd.</p>
        <p>Még több fordított objektíves makrót és más egyéb fotóimat <ExternalLink href="http://www.csikosistvan.com/">itt tudjátok megtekinteni</ExternalLink>.
        </p>
        <p>Üdvözlettel: Csíkos István</p>

        <h2 id="Egyeb_forrasok_forditott_objektives_makrofotozas_temaban">Egyéb források fordított objektíves makrófotózás témában</h2>
        <p>
            <ExternalLink href="https://500px.com/krisztinmrkus">Márkus Krisztián 500px oldala</ExternalLink>
        </p>
        <p>
            <ExternalLink href="http://kocsisgaborfoto.blogspot.hu/2014/02/makro-kicsit-megkozelebbrol-2resz.html">Kocsis Gábor technikai jellegű írása a fordított objektívekről</ExternalLink>
        </p>
        <p>
            <ExternalLink href="http://kovadrifoto.blogger.hu/2013/10/04/makrofotozas-forditott-objektivvel-2">Kovács Adrienn írása</ExternalLink>
        </p>
        <p>
            <ExternalLink href="http://thomasshahan.com/#photos">Thomas Shahan képei </ExternalLink>és <ExternalLink href="https://www.youtube.com/user/terser">videói</ExternalLink>
        </p>
    </>;
}