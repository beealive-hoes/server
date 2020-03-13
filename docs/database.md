# Database



# data_long

## id: INT
als binär:
0 0 0 0 0 0 0 0
\_________/ \_/
Tage seit   letzten 2 Bits:
1. 1. 2020  0 - Tagesminimum
(beliebig   1 - Tagesmaximum
  viele     2 - Tagesdurchschnitt
 Stellen)   3 - am Tag um 12 Uhr



# data_short

## timestamp: SMALLINT
als binär:
0 0 0 0 0 0 0 0
\_____/ \_____/
Tag im   Stunde am Tag (mit 0 beginnend logischerweise)
Monat
(auch mit
0 beginnend)
(keine Konflikte da nach einer Woche so wie so aussortiert wird)
