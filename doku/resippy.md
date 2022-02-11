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

