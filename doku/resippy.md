# Luftqualität durch Corona

## Einführung

### Abstract 
Nichts hat die globale und unsere alltägliche Welt zurzeit so im Griff wie die sogenannte „Corona-Krise“ und der Umgang mit dem neuartigen Virus SARS-CoV-2. Damit sich die hochansteckende Lungenkrankheit Covid-19, die aus dem Virus resultiert, nicht weiterhin ausbreitet und das deutsche Gesundheitssystem überlastet, sind im März 2020 verschiedene Maßnahmen von der deutschen Bundesregierung erlassen worden, wie beispielsweise eine Ausgangssperre in Bayern und anderen Bundesländern, die bundesweite Schließung von Schulen und Kitas, Geschäften, Cafés, Bars, Restaurants, Theatern und Kulturzentren oder ein generelles soziales (körperliches) Kontaktverbot.
In diesem Semster (WS21) war es unsere Aufgabe im Rahmen der GDV-Veranstaltung uns in Gruppen, ein aktuelles Thema unter die Lupe zu nehmen und es mit denen in der Vorlesung gelernten Visualisierungsarten, auch für andere Betrachter einfach und verständlich zu visualisieren.
Das von unserer Gruppe genommene Thema war die Untersuchung der Luftqualität im Bezug zu den vom Bundesland abhängigen Corona Maßnahmen.

### Einleitung
Die Auswirkungen der aufgesetzten Coronamaßnahmen machen sich in vielen Bereichen unseres alltäglichen Lebens bemerkbar. Aufgrund des breit gefächerten Einflusses auf diverse Themengebiete zum Thema Corona und Luftqualität, stießen wir in der Findungsphase unseres Projektes auf vielfältige Fragestellungen in den verschiedensten Bereichen, welche eine interessante Basis zur visuellen Aufbereitung und Analyse der damit verbundenen Datensätze boten. 
Unsere erste Hürde lag darin eine Hypothese aufzustellen die diesem Thema gerecht wird. Eine Überlegung war es ob die Luftqualität, durch Coronamaßnahmen eine positive Auswirkung auf die Gesundheit der Menschen auswirke. Dies zu bestätigen, fiel schwer da unsere Datenmenge keine Aussage lieferte im Bezug zur Gesundheit. Dennoch haben wir untrersucht wie die Coronamaßnahmen im Allgemeinen Auswirkungen auf die Luftqualtität haben. Unsere Auswertungen liefern zb. für Feinstaub eine klare Verringerung über 3 Jahre hinweg. Vorallem einen großen Unterschied gab es an Silvester. Hier war der Feinstaub in Bundesländern ohne Feuerwerk-Einschränkungen um ein vielfaches höher als in anderen Bundesländern. Eine interessante Erkenntnis, welche uns vorher nicht bewusst war, aber durch die Visualisierung aufgefallen ist, ist der Saharasturm in Deutschland von Februar 2021. Hier gibt es an vielen Messstationen einen klaren Anstieg der Feinstaubwerte über 2-3Tage hinweg.

### Fragen & Hypothesen

Haben die Coronamaßnahmen positiven Einfluss auf die Gesundheit im Bezug zur Luftqualität?
- Dies zu bestätigen, fiel schwer da unsere Datenmenge keine Aussage lieferte im Bezug zur Gesundheit.

Die Luftqualität hat sich pandemiebedingt aufgrund der Corona-Maßnahmen in den untersuchten Städten gebessert?
-  Unsere Auswertungen lieferten eine klare Besserungen der Luftqualität über 3 Jahre konstant hinweg. Für Feinstaub zb. gab es einen großen Unterschied an Silvester. Hier war der Feinstaub in Bundesländern ohne Feuerwerk-Einschränkungen um ein vielfaches höher als in anderen Bundesländern. Eine interessante Erkenntnis, welche uns vorher nicht bewusst war, aber durch die Visualisierung aufgefallen ist, ist der Saharasturm in Deutschland von Februar 2021. Hier gibt es an vielen Messstationen einen klaren Anstieg der Feinstaubwerte über 2-3Tage hinweg.

Hat sich die Luftqualität in den Jahren der Corona-Pandemie gebessert im Verhältnis zu dem vorherigen Jahr?
- Unsere Auswertungen liefern zb. für Feinstaub eine klare Verringerung über 3 Jahre hinweg

## Daten

### Datenquelle

In diesem Abschnitt schildern wir welche Datenquellen wir verwendet haben und wie diese aufgebaut sind. Wir haben für dieses Projekt zwei Quellen verwendet: Die MVV-API um die Luftdaten von Mannheim (pro Stunde) zu erhalten. Die Luftdaten der anderen Städte haben wir über die API des Umweltbundesamts gezogen (ebenfalls pro Stunde). Die Daten wurden von unserem Backend täglich angefordert und entsprechend Umgeformt

### MVV- API

Die MVV-Daten wurden über die Schnittstelle Timeseries bezogen die den Schlüssel des jeweiligen Schadstoﬀs als Parameter bekommt und dann den angegebenen Zeitraum zurück liefert.
Beispiel Antwort: [  {    "timeSeriesId": "dace4e86-d69a-492b-86f1-1fd368185d42",    "timestamps": [      "2021-02-01T16:02:35.000Z",      "2021-02-01T16:02:34.000Z"    ],    "values": [      1954.42,      1954.02    ],    "error": null  } ]

### Umweltbundesamt-API

Die Daten des Umweltbundesamtes wurden über die Schnittstelle Get airquality data bezogen die als Parameter die Stations Id der jeweiligen Messtation sowie einen Zeitlichen Rahmen erwartete. Als antwort bekommt man seinen request, die idices und die Daten.
Beispiel Antwort: {
1
 "request": {…}, "Indices":{   "Data":{     "station id":{  "date start":    ["component id","scope id","value","date end","index"]     }    } }, "Data":{   "51":{     "2020-01-01 07:00:00":[1,2,12,"2020-01-01 08:00:00",null]   } } } 

### Datenaufbereitung

Da wir bei den Daten des Umweltbundesamtes potentiell mehrere (0..x) Messwerte pro Stadt pro Schadstoff hatten bilden wir den Durchschnitt aller Gültiger Messwerte und schreiben diesen in unsere Datenbank

// Bilder

Für beide API-antworten haben wir die entsprechenden Schadstoffnamen zugeordnet, außerdem haben wir die Daten in Local Unix-Timestamps umgewandelt da diese leichter maschinell zu verarbeiten sind. Um anfragen an unsere API zu minimieren hat sie nur eine Schnittstelle um alle Daten die das Frontend benötigt bereitzustellen.

// Bilder

Da es sich um die Daten der Letzten drei Jahre handelt und es nicht performant wäre diese bei jeder Anfrage aus der Datenbank zu ziehen haben wir einen Cache implementiert der die Antwort Sortiert vor gespeichert hat. Wir bringen diesen Cache in einem min. Eintages Intervall auf den neusten Stand. Beispiel Json Struktur unserer API:
3
[ {  "City": "München",  "TimeSeriesId": "pm10",  "TimeStamp": 1641279600,  "Value": 6.333333333333333 },    {  "City": "München",  "TimeSeriesId": "o3",  "TimeStamp": 1641279600,  "Value": 15.0 }, … ] 

### Datenaggregation

Bei unserer explosiven Datenanalyse wurde relativ schnell klar das es wenig Sinn ergibt alle Daten zu plotten. Bei einigen Schadstofftypen haben die Menge an Datenpunkten zu einem zu Starken Rauschen geführt wodurch die Visualisierung unbrauchbar würde. // Bild Grafik vor Aggregation Wir haben uns dafür entschieden nur noch einen Wert pro Tag zu verwenden. Der Durchschnitt wäre wohl der offensichtlichste weg gewesen allerdings wollten wir explizit starke Ausschläge aufzeigen und diese wären dadurch weichgezeichnet worden, aufgrund dessen haben wir uns dafür entschieden nur den Maximalwert pro Tag zu benutzen. // Bild Grafik nach Aggregation 

### Explorative Datenanalyse 

Ein Beispiel unserer EDA, in einem frühen Stadium des Projekts, war es herauszufinden ob lokale Coronamaßnahmen (Lockdown / Ausgangssperren) einen Messbaren Einfluss auf die Luftqualität hat.

// Bilder

Wir haben die Zeiträume der Lockdowns eingefärbt um zu erkennen ob es einen Offensichtlichen Zusammenhang zwischen Luftqualität und Maßnahmen gibt. Da dies nicht der Fall ist sind wir davon abgekommen lokale Maßnahmen mit untersuchen zu wollen.

## Prototyp

### Vortstellung

Die grundlegende Funktionalität dieses Prototyps besteht darin, dass Benutzer Zeiträume individuell auswählen und bei Bedarf vergleichen können. Dies soll ihm eine gezielte Erkundung und Analyse der Daten ermöglichen und darüber hinaus eine Grundlage für die Beantwortung der von uns aufgestellten Hypothesen liefern. Dieser Prozess sollte mit Hilfe eines Liniendiagramms unterstützt werden, das die Daten für den aktuell ausgewählten Zeitraum darstellt.
Basierend auf diesen Überlegungen wurde entschieden, Liniendiagramme und Karten für die Menüführung zu verwenden. Für eine genauere Betrachtung des Zeitraums besteht die Möglichkeit, den Schieberegler zu verwenden.
Unter Bezugnahme auf unsere Annahmen werden die Umweltemissionen in verschiedene Kategorien eingeteilt, die über Dropdown-Menüs verwaltet werden.


### Visualisierung & Interaktionstechnik

Für eine Darstellung haben wir uns für das Liniendiagramm entschieden die sich aus zwei Quantitative Merkmale zusammensetzt.Auf der X-Achse wird das Datum dargestellt und auf der Y-Achse der jeweilige Emissionswert.

Wir haben uns für das JavaScript Framework D3 entschieden, es handelt sich hierbei um eines der bekanntesten Visualisierungsframeworks, das in unserem Entscheidungsprozess aufgrund seiner Vielfalt schnell Alternativen wie Google Charts. Es wurde bewusst darauf verzichtet, ein zusätzliches serverseitiges Framework zu verwenden, sondern die Datenaufbereitung innerhalb des Dashboards komplett clientseitig in Svelte zu erledigen.

Einer der Gründe für diese Entscheidung war, dass jedes Mal, wenn sich der ausgewählte Zeitraum änderte, unser Dashboard vollständig aktualisiert werden musste. Da dieser Vorgang in der von uns beabsichtigten Art und Weise sehr häufig vorkommt, möchten wir vermeiden, dass die Seite jedes Mal neu geladen werden muss, was den reibungslosen Arbeitsablauf des Benutzers behindert.
Zur Visualisierung wurde Svelte verwendet. Der Vorteil von Svelte besteht darin, dass es komplexen Rahmencode in optimiertes, einfaches JavaScript umwandeln kann. Svelte hat während der Entwicklung Anwendungen zu dünnem, optimiertem JavaScript kompiliert.

Zur Darstellung haben wir uns für ein Liniendiagramm entschieden, da es sich aus zwei quantitativen Merkmalen zusammensetzt. Auf der x-Achse steht das Datum und auf der y-Achse entsprechende Emissionswerte dargestellt.

### Implementierung

Als Programmiersprache haben wir uns aufgrund der vielen Frameworks und das wir als Zielsystem den Browser haben für Javascript entschieden.
Zur Umsetzung unserer Implementierungsvision haben wir uns aufgrund des Umfangs der Funktionalitäten für d3.js entschieden. Wir konnten d3.js nicht nur für die reine Visualisierung verwenden sondern auch für die Daten Umformung in besser zu verarbeitendes Format.
Die Interaktivität unseres Dashboards haben wir durch den Datenfluss in einer Komponenten basierten Struktur unseres Programms umgesetzt. 
Zur Umsetzung dieser Komponenten Struktur kam aufgrund der Performance und der einfachen handhabe des Datenflusses das Framework Svelte zum Einsatz.

## Erkenntnisse

Zu welchen Erkenntnissen führte unser Projekt nun schlussendlich? In dem von uns untersuchten Zeitraum von 3 Jahren, häuften sich einige Daten an. Doch liefern diese auch entsprechende Erkenntnisse und lassen uns Aussagen über die von uns gestellten Hauptfragen treffen? 

### Hat sich die Luftqualität in den Jahren der Corona-Pandemie gebessert im Verhältnis zu dem vorherigen Jahr?

Der von uns gewählte Beobachtungszeitraum reicht vom 14. Januar 2019 bis hin zum 15. Januar 2022. Durch diese gewählte Zeitspanne erlangen wir Einsicht über die Schadstoffwerte eines Vor-Corona-Jahres im Vergleich zu den darauffolgenden 2 Corona-Jahren. 
Wie in Abb. 1 zu sehen ist, lässt sich in Mannheim tatsächlich ein klarer Rückschritt des Schadstoffs NO2 (Stickstoffdioxid) erkennen. Dieser Rückschritt hält sich von Jahr zu Jahr.
Ob diese Verringerung jedoch auf die Corona Maßnahmen zurückzuführen ist, lässt sich mit voller Gewissheit allerdings nicht sagen. 
Wichtig anzumerken ist hierbei, dass Mannheim in diesem Fall nur als Repräsentant dient, der NO2 Rückschritt lässt sich allerdings in jeder der 4 untersuchten Städte feststellen.

(Abb.1)

### Events

Neben jährlichen Vergleichen, innerhalb einzelner Städte, stießen allerdings auch Auffälligkeiten hervor, die sich auf spezielle Ereignisse zurückführen lassen. Bestimmte Events, waren uns von vorne rein bewusst, allerdings stießen wir auch auf Überraschungen.

### Silvester

Da sich die Silvesternacht gerade hinsichtlich, der Luftqualität anbietet genauer betrachtet zu werden, hatten wir zu den Jahresübergängen direkt die erste Anlaufstelle für weitere Untersuchungen. Laut dem Umweltbundesamt macht Feuerwerk knapp ein Prozent der jährlichen PM10 (Feinstaub) – Gesamtemission aus. Somit gehört die Neujahrsnacht gewöhnlich zu der höchsten Feinstaubbelastung im ganzen Jahr. Da ein pandemiebedingtes Böllerverbot in ganz Deutschland herrschte, gingen wir davon aus, einen signifikanten Unterschied zwischen Silvester 2019 & Silvester 2021 zu entdecken. Und wie zu erwarten zeigt Abb.2 am 31.12.2019 in allen Städten einen deutlichen Ausreißer verglichen zu den Vor- und Folgetagen. München erreicht hierbei mit einem Feinstaubwert von 828 µg/m³ den absoluten Höchstwert. Betrachtet man nun das Folgejahr, so sieht man am 31.12.2020 einen erheblichen unterschied des Feinstaubwertes. Die Städte Mannheim, Stuttgart & München bewegen sich, je nach Stadt, zwischen 13 – 52 µg/m³. 
Als einzig nennenswertes Hoch, sieht man hier nur Berlin, das mit 130 µg/m³ auch klar den Höchstwert dieses Tages erreicht. Den genauen Grund diesen Peak konnten wir leider nicht finden, jedoch ziehen wir in Betracht, dass die offiziellen Feuerwerke in Berlin hierbei eine große Rolle spielen könnte. 

(Abb.2)
(Abb.3)

### Sahara Sturm

Neben absehbaren, jährlichen Events gab es jedoch auch weitere nennenswerte Schwankungen innerhalb der Feinstaub (PM10) Messungen. So lässt sich auch der Sahara Sturm, der im Februar Deutschland erreichte, in der Feinstaubbelastung erkennen. Dieser Sorgte in allen 4 Städten für einen bemerkbaren Anstieg über mehrere Tage hinweg.  Events wie diese fielen uns erstmals währen der EDA auf und konnten erst nach Recherche fest zugeordnet werden.

(Abb. 4)

## Fazit 

Unser Ziel war es mit unserem Prototypen eine Verbesserung der Luftqualität aufgrund der Corona-Maßnahmen abzubilden, jedoch haben wir nach Analyse keine grundlegende Verbesserung entdecken können. Als Kontrapunkt lässt sich von unserer Seite aus argumentieren, dass es schwer für uns war eine Forschungsfrage zu finden, die auch große Einschläge zu visualisieren lässt. Andererseits haben wir aus der detaillierter Erkenntnissuche nach großen Einschlägen wegen der Corona-Maßnahmen, neue Erkenntnisse wie beispielsweise an Silvester oder auch den Sahara-Sturm entdeckt. Obwohl wir mit diesem Prototyp nicht alle unsere Fragen zu unserer vollen Zufriedenheit beantworten konnten, waren wir mit dem Endergebnis des Projektes sehr zufrieden.

## Ausblick

Bei einer Fortsetzung des Projektes wäre es aus unserer Sicht sinnvoll, unsere Datensätze bescheidener zu aggregieren. Dies hätte den Vorteil, dass die Linien auf dem Liniendiagramm repräsentativer für den Nutzer sind und somit auch gründliche Erkenntnisse liefern würden. Darauf aufbauend wird vorgeschlagen, Durchschnittsdatensätze pro Tag zu bilden, damit einzelne Einschläge der Werte nicht mehr isoliert betrachtet werden. Dies hätte aber auch den Nachteil, dass große Einschläge bei den Luftmesswerten nicht mehr hervorstechen, da der Durchschnitt der Werte betrachtet wird. Zudem würden wir eine Trendlinie zu dem Liniendiagramm einzeichnen, der den prozentuellen Anteil des Durchschnittswertes zu dem gewünschten Zeitraum abbildet.

## Kurs 

Dokumentation über das Projekt “Luftqualität während der Pandemie” zum Thema “Smart City Strategie Mannheim” des Kurses Grundlagen der Datenvisualisierung von Prof. Dr. Till Nagel im Wintersemester 2021/2022 der Hochschule Mannheim.
