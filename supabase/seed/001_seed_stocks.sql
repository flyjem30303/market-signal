insert into public.stocks (
  symbol,
  name,
  market,
  industry,
  listed_date,
  is_etf,
  is_active
) values
(
  'TWII',
  '台灣加權指數',
  'INDEX',
  '指數',
  null,
  false,
  true
),
(
  '0050',
  '元大台灣50',
  'TWSE',
  'ETF',
  '2003-06-30',
  true,
  true
),
(
  '006208',
  '富邦台50',
  'TWSE',
  'ETF',
  '2012-07-17',
  true,
  true
),
(
  '2330',
  '台積電',
  'TWSE',
  '半導體',
  '1994-09-05',
  false,
  true
),
(
  '2454',
  '聯發科',
  'TWSE',
  'IC 設計',
  '2001-07-23',
  false,
  true
),
(
  '2317',
  '鴻海',
  'TWSE',
  '電子代工',
  '1991-06-18',
  false,
  true
),
(
  '2308',
  '台達電',
  'TWSE',
  '電源/工控',
  '1988-12-19',
  false,
  true
),
(
  '2382',
  '廣達',
  'TWSE',
  'AI 伺服器',
  '1999-01-08',
  false,
  true
),
(
  '2412',
  '中華電',
  'TWSE',
  '電信',
  '2000-10-27',
  false,
  true
),
(
  '2882',
  '國泰金',
  'TWSE',
  '金融',
  '2001-12-31',
  false,
  true
)
on conflict (symbol) do update set
  name = excluded.name,
  market = excluded.market,
  industry = excluded.industry,
  listed_date = excluded.listed_date,
  is_etf = excluded.is_etf,
  is_active = excluded.is_active,
  updated_at = now();
