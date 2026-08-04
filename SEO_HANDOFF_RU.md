# ReplaceWaterHeaters: полный SEO handoff

Обновлено: 2026-08-04  
Проект: `C:\Users\eugen\Documents\waterh`  
Production: https://replacewaterheaters.com/  
GitHub: https://github.com/Eugene15/replacewaterheaters  
Ветка деплоя: `main`

Этот документ предназначен для продолжения SEO-работы в новом чате. Он фиксирует решения, результаты DataForSEO, структуру посадочных страниц, ограничения бизнеса, технический статус и точные пути ко всем исходным данным.

## 1. Что уже сделано

- Собран и опубликован основной лендинг Sacramento.
- Домен подключён к AWS Amplify, push в `main` автоматически запускает production deployment.
- Основной домен без `www`; `www` перенаправляется на него кодом 301.
- На главной настроены title, description, canonical, Open Graph, LocalBusiness/HomeAndConstructionBusiness JSON-LD и FAQPage JSON-LD.
- Созданы `robots.txt` и `sitemap.xml`.
- Проведены Keyword Discovery, Keyword Ideas, Search Volume и локальные Google SERP исследования через DataForSEO.
- Исследованы Sacramento/Placer и основные рынки California: Bay Area, Los Angeles County, Orange County, Ventura County, Santa Barbara County и San Diego County.
- Зафиксирована programmatic/local SEO архитектура городских страниц.
- Все raw API ответы и скрипты сохранены в Git.
- Оптимизированы изображения и критический рендеринг для Lighthouse/PageSpeed.

## 2. Неподвижные бизнес-ограничения

- Бизнес оказывает **только замену водонагревателей**.
- Ремонт водонагревателей не предлагать и не создавать под него страницы.
- Можно указывать типы: tank, tankless, gas, electric, heat pump.
- Same-day appointments можно указывать как доступную опцию с оговоркой о расписании и наличии оборудования.
- Пока нельзя публиковать неподтверждённые заявления о:
  - лицензии;
  - гарантии;
  - годах работы;
  - рейтинге;
  - реальных отзывах;
  - количестве клиентов или выполненных замен.
- Телефон: **(916) 265-7756**.
- Главная конверсия: звонок или форма запроса услуги.
- Форма сейчас формирует SMS на `+19162657756`; backend/CRM ещё не подключён.

## 3. Что исключено из SEO-ядра

Пользователь отдельно исключил запросы с товарным или справочным интентом:

- `40 gallon water heater`
- `50 gallon water heater`
- `water heater lifespan`
- `how long does a water heater last`
- Rheem
- Bradford White
- AO Smith
- Rinnai
- Navien

Не создавать страницы по объёму бака, сроку службы или отдельным брендам без нового решения пользователя. Не смешивать e-commerce/product intent с локальной услугой replacement.

## 4. Правило стоимости DataForSEO

**Перед каждым новым платным запросом DataForSEO обязательно сначала сообщить пользователю точную или максимально близкую оценку стоимости и только затем выполнять запрос.**

Это правило относится к DataForSEO. Стоимость обычных правок и деплоя сообщать не требуется.

Доступы находятся в локальном `.env`. Файл игнорируется Git. Никогда не выводить пароль в чат, логи, handoff или коммит.

Переменные:

```text
DATAFORSEO_USERNAME
DATAFORSEO_PASSWORD
DATAFORSEO_BASE_URL
```

## 5. Методика исследования

Исследование не строилось только на вручную придуманных комбинациях `{service} + {city}`.

Использованные направления DataForSEO:

1. Keyword discovery / Keywords for Keywords по широкому Sacramento seed.
2. Keyword Ideas для получения реальных формулировок из базы.
3. Google Ads Search Volume для утверждённых коммерческих кластеров.
4. Google SERP API с city-level location для проверки локальной городской выдачи.
5. Расширенная матрица California cities.
6. Подсчёт distinct commercial cluster volume по выбранным рынкам.

Правила интерпретации:

- Близкие варианты одного интента нельзя складывать.
- Например, `water heater replacement sacramento`, `water heater replacement sacramento ca`, `water heater replacement in sacramento` и `sacramento water heater replacement` относятся к одному replacement-кластеру.
- Для каждого кластера берётся вариант с наибольшим volume, а не сумма словоформ.
- Ноль означает, что DataForSEO не показал измеримый объём на доступной гранулярности. Это не абсолютное отсутствие запросов.
- CPC и Ads competition показывают коммерческую ценность/рекламную конкуренцию, но не являются organic keyword difficulty.
- Городская выдача проверяется через Google SERP API с подменой location, а не через Keyword Ideas.

## 6. Затраты DataForSEO

| Исследование | Raw file | API cost |
| --- | --- | ---: |
| Sacramento keyword discovery | `sacramento-keyword-discovery.json` | $0.01272 |
| Sacramento keyword ideas, 1,000 строк | `sacramento-keyword-ideas.json` | $0.132 |
| Проверка выбранных Sacramento/Placer long tails | `validated-local-keyword-volume.json` | $0.09 |
| Локальные SERP для 7 Sacramento/Placer городов | `city-serps-water-heater-replacement.json` | $0.028 |
| Расширенная California city demand, 362 строки | `california-city-demand.json` | $0.09 |
| Кластеры для 17 выбранных рынков, 272 строки | `market-cluster-demand.json` | $0.09 |

Суммарно по сохранённым исследованиям: **$0.44272**.

## 7. Sacramento: подтверждённое ядро

| Ключ / представитель кластера | Volume / month | CPC | Ads competition | Решение |
| --- | ---: | ---: | --- | --- |
| `water heater replacement sacramento` | 170 | $32.62 | High | Главный primary keyword homepage |
| `water heater installation sacramento` | 70 | $24.52 | Medium | Вторичный кластер homepage |
| `water heater replacement cost sacramento` | 30 | $14.09 | High | Cost section + FAQ |
| `tankless water heater sacramento` | 40 | см. raw | см. raw | Секция на homepage; отдельная service page позже |

Итого distinct commercial volume Sacramento: **310 запросов/месяц**.

Близкие replacement-варианты, которые нельзя суммировать:

- `water heater replacement in sacramento` — 170
- `water heater replacement sacramento ca` — 170
- `sacramento water heater replacement` — 170

Проверенные long tails:

| Keyword | Volume | Использование |
| --- | ---: | --- |
| `same day water heater replacement sacramento` | 0 | Supporting copy, не отдельная страница |
| `gas water heater replacement sacramento` | 0 | Секция/подтема |
| `electric water heater replacement sacramento` | 0 | Секция/подтема |
| `heat pump water heater replacement sacramento` | 0 | Секция/подтема |
| `water heater replacement roseville` | 20 | Городская посадочная |
| `water heater replacement lincoln` | 20 | Backlog городской посадочной |
| `water heater replacement rocklin` | 0 | Не приоритет |
| `water heater replacement granite bay` | 0 | Не приоритет |
| `water heater replacement loomis ca` | 0 | Не приоритет |

## 8. Утверждённые рынки и суммарный volume

Сумма считается только по distinct кластерам replacement + installation + cost + tankless.

| Приоритет | Market | Replacement | Installation | Cost | Tankless | Total/month |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | Sacramento | 170 | 70 | 30 | 40 | **310** |
| 2 | San Diego | 320 | 390 | 30 | 110 | **850** |
| 3 | San Jose | 110 | 170 | 10 | 20 | **310** |
| 4 | Huntington Beach | 70 | 50 | 0 | 10 | **130** |
| 5 | Orange County | 50 | 70 | 0 | 20 | **140** |
| 6 | Livermore | 70 | 70 | 0 | 10 | **150** |
| 7 | San Francisco | 40 | 20 | 10 | 10 | **80** |
| 8 | Fremont | 40 | 40 | 0 | 0 | **80** |
| 9 | Los Angeles | 30 | 70 | 10 | 30 | **140** |
| 10 | Folsom | 30 | 0 | 0 | 0 | **30** |
| 11 | Roseville | 20 | 40 | 0 | 10 | **70** |
| 12 | San Mateo | 20 | 20 | 0 | 0 | **40** |
| 13 | Sunnyvale | 20 | 0 | 0 | 0 | **20** |
| 14 | Santa Monica | 20 | 10 | 0 | 10 | **40** |
| 15 | Chula Vista | 20 | 10 | 0 | 10 | **40** |
| 16 | Carlsbad | 20 | 10 | 0 | 10 | **40** |
| 17 | Thousand Oaks | 90 | 10 | 0 | 10 | **110** |

Сумма по 17 рынкам без повторного сложения близких вариантов: **2,580 запросов/месяц**.

Это утверждённый рабочий порядок рынков, но перед публикацией каждой страницы нужно подтвердить, что компания реально обслуживает этот город.

## 9. География исследования

На данный момент исследован только штат **California**. Другие штаты пока не исследовались.

### Sacramento / Placer

- Sacramento
- Roseville
- Folsom
- Auburn
- Lincoln
- Rocklin
- Granite Bay
- Loomis
- дополнительные города в raw dataset

### Bay Area

- San Jose
- Livermore
- San Francisco
- Fremont
- San Mateo
- Sunnyvale
- Brentwood
- Oakland
- Berkeley
- Concord
- Walnut Creek
- Pleasanton
- Dublin
- Hayward
- Santa Rosa
- Fairfield
- Novato
- Mill Valley
- Petaluma
- остальные города в raw dataset

### Los Angeles County

- Los Angeles
- Santa Monica
- Burbank
- Glendale
- Malibu
- Beverly Hills
- Agoura Hills
- Hollywood
- Calabasas
- Pasadena
- Long Beach
- Santa Clarita
- Lancaster
- Palmdale
- Arcadia
- Lakewood
- остальные города в raw dataset

### Orange County

- Huntington Beach
- Irvine
- Anaheim
- Orange
- Newport Beach
- Mission Viejo
- Laguna Beach
- Laguna Niguel
- Lake Forest
- Garden Grove
- Fountain Valley
- Fullerton
- Aliso Viejo
- Brea
- La Habra
- Placentia
- остальные города в raw dataset

### San Diego County

- San Diego
- Chula Vista
- Carlsbad
- Oceanside
- Encinitas
- Escondido
- San Marcos
- Vista
- El Cajon
- La Mesa
- Santee
- Lakeside
- Del Mar
- Coronado
- Imperial Beach
- National City
- Lemon Grove
- Fallbrook
- остальные города в raw dataset

### Ventura County / Santa Barbara County

- Thousand Oaks
- Ventura
- Oxnard
- Camarillo
- Moorpark
- Ojai
- Santa Barbara
- Goleta
- дополнительные города в raw dataset

## 10. Дополнительные найденные возможности

| City | Best replacement keyword | Volume | Комментарий |
| --- | --- | ---: | --- |
| Hollywood | `water heater replacement hollywood` | 90 | Проверить неоднозначность SERP и реальную зону обслуживания |
| Brentwood | `water heater replacement brentwood` | 70 | Проверить California intent |
| Auburn | `water heater replacement auburn` | 20 | Sacramento/Placer expansion |
| Lincoln | `water heater replacement lincoln` | 20 | Sacramento/Placer expansion |
| Lakeside | `water heater replacement lakeside` | 20 | San Diego expansion |
| Santee | `water heater replacement santee` | 20 | San Diego expansion |
| Malibu | `water heater replacement malibu ca` | 10 | Высокий CPC, но небольшой volume |
| Agoura Hills | `water heater replacement agoura hills ca` | 10 | LA County backlog |
| Burbank | `water heater replacement burbank` | 10 | LA County backlog |
| Glendale | `water heater replacement glendale` | 10 | Проверить California SERP |

Полный список не копировать вручную из этой таблицы. Источник истины для всех 362 строк: `california-city-demand.json`.

## 11. Принятая SEO-архитектура

Главная сейчас таргетирует Sacramento. Все остальные города должны находиться под единым service-area hub.

```text
Homepage — Sacramento water heater replacement (/)
├── Replacement service hub (/water-heater-replacement/)
│   └── Future tankless page (/tankless-water-heater-replacement/)
├── Service areas hub (/service-areas/)
│   ├── Roseville (/service-areas/roseville-ca/)
│   ├── Folsom (/service-areas/folsom-ca/)
│   ├── San Diego (/service-areas/san-diego-ca/)
│   ├── San Jose (/service-areas/san-jose-ca/)
│   ├── Huntington Beach (/service-areas/huntington-beach-ca/)
│   ├── Livermore (/service-areas/livermore-ca/)
│   ├── San Francisco (/service-areas/san-francisco-ca/)
│   ├── Fremont (/service-areas/fremont-ca/)
│   ├── Los Angeles (/service-areas/los-angeles-ca/)
│   ├── San Mateo (/service-areas/san-mateo-ca/)
│   ├── Sunnyvale (/service-areas/sunnyvale-ca/)
│   ├── Santa Monica (/service-areas/santa-monica-ca/)
│   ├── Chula Vista (/service-areas/chula-vista-ca/)
│   ├── Carlsbad (/service-areas/carlsbad-ca/)
│   └── Thousand Oaks (/service-areas/thousand-oaks-ca/)
├── Contact (/contact/)
├── Privacy (/privacy/)
└── Terms (/terms/)
```

## 12. Как работать с county и metro запросами

- Bay Area нельзя считать одним городом. Основная стратегия: реальные city pages.
- Los Angeles County нужно разбивать на реальные города, если они обслуживаются: Los Angeles, Santa Monica, Burbank, Glendale, Malibu, Beverly Hills, Agoura Hills и т.д.
- Orange County также требует отдельных городских страниц: Huntington Beach, Irvine, Anaheim и т.д.
- County/metro page можно создать только как полезный региональный hub с уникальной информацией.
- Не создавать одновременно тонкую county page и десятки одинаковых city pages ради количества URL.
- Страница должна соответствовать реальной зоне обслуживания. Volume сам по себе не даёт права заявлять обслуживание города.

## 13. Keyword mapping одной городской страницы

На один город создаётся одна основная коммерческая посадочная.

| Element | Template |
| --- | --- |
| URL | `/service-areas/{city-slug}-ca/` |
| Primary keyword | `water heater replacement {city}` |
| Secondary keyword | `water heater installation {city}` |
| Supporting cluster | `water heater replacement cost {city}` |
| Supporting cluster | `tankless water heater {city}` |
| Supporting phrases | same-day, gas, electric, heat pump |
| Title | `Water Heater Replacement in {City}, CA | Wellmade` |
| H1 | `Water heater replacement in {City}` |
| Canonical | self-referencing absolute URL |

Не создавать отдельные gas/electric/heat-pump/same-day/cost/installation страницы для каждого города, если SERP не показывает другой интент и volume отсутствует. Эти темы пока должны быть секциями одной городской страницы.

## 14. Структура городской посадочной

1. Hero: `{City} + water heater replacement`, телефон и форма.
2. Уникальный local intro.
3. Replacement options: tank, tankless, gas, electric, heat pump.
4. `Water heater installation in {City}` section.
5. Cost section без выдуманных фиксированных цен.
6. Same-day scheduling с оговоркой о доступности.
7. Реальная локальная информация: ZIP codes, районы, типичная застройка, route context, permit/utility details только после проверки.
8. Процесс: request → confirm details → schedule replacement.
9. 4–6 уникальных city-specific FAQ.
10. Ссылки на 2–4 соседних обслуживаемых города.
11. Ссылка назад на `/service-areas/`.
12. Финальный call/form CTA.

Минимальные требования качества:

- не менее трёх проверенных локальных деталей;
- уникальные intro, FAQ, service-area copy, title и meta description;
- нельзя просто менять название города в одном тексте;
- незаконченные страницы не добавлять в sitemap и держать `noindex` или не публиковать;
- никаких выдуманных landmarks, историй клиентов, лицензий, отзывов и гарантий;
- целевой объём страницы ориентировочно 900–1,500 слов, но полезность важнее количества.

## 15. Internal linking

- Homepage → `/service-areas/` и первые Sacramento/Placer pages.
- Service-area hub → все опубликованные города, сгруппированные по metro/county.
- City page → hub + 2–4 соседних города.
- Breadcrumb: `Home > Service Areas > {City}`.
- Анкоры описательные: `water heater replacement in Roseville`, а не `learn more`.
- Никаких orphan pages.
- В XML sitemap включать только canonical, indexable, полностью готовые URL.

## 16. Порядок публикации

1. Сохранить Sacramento homepage как primary Sacramento page.
2. Создать `/service-areas/`.
3. Создать Roseville и Folsom, чтобы сформировать логичный Sacramento/Placer cluster.
4. Проверить реальную зону обслуживания для удалённых рынков.
5. Публиковать следующие города по утверждённому списку, а не массово все 362 комбинации.
6. После каждой небольшой партии обновлять sitemap.
7. Отправлять URL на индексацию через Google Search Console.
8. Отслеживать impressions, clicks, calls и form leads отдельно по городу.
9. Страницы без impressions улучшать или объединять, а не компенсировать выпуском новых thin pages.

## 17. Schema и technical SEO для будущих страниц

- Homepage: `HomeAndConstructionBusiness` с подтверждёнными полями.
- City pages: `Service` + ссылка на бизнес entity.
- Не указывать фиктивный физический адрес в каждом городе.
- BreadcrumbList на city pages.
- FAQPage только при наличии видимого FAQ и если это соответствует текущим правилам Google.
- Unique title, description, H1, canonical, Open Graph.
- Телефон в формате `tel:+19162657756`.
- Mobile-first верстка, responsive images, WebP, preload только LCP.
- Обновлять XML sitemap при публикации новых canonical URL.

## 18. PageSpeed/Lighthouse status на 2026-08-04

Что оптимизировано:

- mobile hero: PNG 2.1 MB → WebP около 19 KB;
- desktop hero: WebP около 52 KB;
- header/footer logo: PNG 820 KB → WebP около 5.8 KB;
- добавлен favicon;
- удалён внешний Google Fonts request, используется системный font stack;
- LCP image переведён из CSS background в discoverable `<picture>/<img>`;
- добавлены `fetchpriority=high` и responsive mobile image;
- добавлен critical CSS;
- основной CSS загружается неблокирующе;
- секции ниже первого экрана используют `content-visibility:auto`;
- исправлены контраст и accessible name кнопки звонка.

Зафиксированные Lighthouse 13.4.1 прогоны:

- Mobile после critical CSS: `100 performance / 96 accessibility / 100 best practices / 100 SEO`, LCP 1.6 s, FCP 1.2 s, CLS 0, TBT 60 ms, SI 1.5 s.
- После добавления critical contrast отдельный mobile прогон подтвердил `100 accessibility / 100 best practices / 100 SEO`, но performance колебался из-за Windows Chrome TBT.
- Desktop: `98 performance / 100 accessibility / 100 best practices / 100 SEO`, LCP 0.5 s, FCP 0.4 s, CLS 0.074, TBT 10 ms, SI 1.1 s.

Задача PageSpeed пока не считается полностью закрытой: нужен свежий официальный PageSpeed Insights API/UI замер после восстановления публичной квоты. API в момент работы отвечал HTTP `429 Too Many Requests`. Lighthouse на Windows также периодически завершался ошибкой очистки временного Chrome profile (`EPERM`) уже после создания валидного JSON отчёта.

Что проверить следующим:

1. PageSpeed Insights mobile и desktop через официальный сервис.
2. Если desktop остаётся 98, найти CLS node в отчёте и добавить его стабильные размеры в critical CSS.
3. Убедиться, что async full CSS не вызывает layout shift.
4. Сохранить только финальные отчёты; временные `.lighthouse-*.json` и `.chrome-lh-*` не коммитить.

## 19. Все raw SEO результаты

Папка:

`research/dataforseo/2026-08-03/`

Файлы:

- `sacramento-keyword-discovery.json` — реальные найденные Sacramento формулировки.
- `sacramento-keyword-ideas.json` — полный массив из 1,000 keyword ideas.
- `validated-local-keyword-volume.json` — 11 выбранных Sacramento/Placer long tails.
- `city-serps-water-heater-replacement.json` — локализованная выдача 7 городов.
- `california-city-demand.json` — полный расширенный dataset, 362 строки.
- `market-cluster-demand.json` — 272 строки по 17 выбранным рынкам и кластерам.

Не пытаться переносить все 1,000+ строк в handoff. Raw JSON уже является полным результатом и сохранён в Git.

## 20. Скрипты воспроизведения

Папка `scripts/`:

- `discover-sacramento-keywords.mjs`
- `discover-sacramento-keyword-ideas.mjs`
- `validate-local-keyword-volume.mjs`
- `research-city-serps.mjs`
- `research-california-city-demand.mjs`
- `research-market-cluster-demand.mjs`
- `research-local-keywords.mjs`

Скрипты читают credentials только из environment variables.

## 21. Основные проектные файлы

- `index.html` — production homepage.
- `styles.css` — полная таблица стилей.
- `script.js` — front-end форма/SMS.
- `robots.txt`.
- `sitemap.xml`.
- `PRODUCT.md` — продуктовый и brand context.
- `SEO_STRATEGY.md` — более короткая английская стратегия/источник решений.
- `SEO_HANDOFF_RU.md` — этот полный handoff.
- `REPLACEWATERHEATERS_HANDOFF.md` — инфраструктура GitHub/AWS Amplify/Cloudflare.

## 22. Что нужно запросить у владельца бизнеса

До масштабного выпуска страниц получить:

- точную service area и подтверждение удалённых рынков;
- реальный business address или подтверждение service-area-only model;
- статус Google Business Profile и primary category;
- часы работы;
- подтверждённые license details;
- условия warranty;
- реальные отзывы;
- фактические годы работы;
- правила same-day availability;
- способ отправки заявок: SMS, email, backend или CRM.

Пока этих данных нет, не подставлять placeholders и не выдумывать trust claims.

## 23. Рекомендуемая следующая задача

Начать с `/service-areas/`, затем собрать две уникальные страницы:

1. `/service-areas/roseville-ca/`
2. `/service-areas/folsom-ca/`

Перед написанием собрать бесплатную фактическую локальную информацию по ZIP codes, районам, housing/installation context и проверить текущие organic SERP. Если для этого используется платный DataForSEO, сначала сообщить стоимость.

## 24. Готовый prompt для соседнего чата

```text
Продолжи SEO проекта C:\Users\eugen\Documents\waterh.
Сначала полностью прочитай SEO_HANDOFF_RU.md, SEO_STRATEGY.md, PRODUCT.md и REPLACEWATERHEATERS_HANDOFF.md.
Все raw DataForSEO результаты находятся в research/dataforseo/2026-08-03/, скрипты — в scripts/.
Не делай новых DataForSEO вызовов, пока заранее не сообщишь их стоимость.
Услуга только water heater replacement, не repair. Не выдумывай license, warranty, reviews или years in business.
Следующий приоритет: service-area hub, затем уникальные Roseville и Folsom pages с approved URL structure и internal linking.
Перед изменениями проверь git status и не удаляй пользовательские файлы.
```
