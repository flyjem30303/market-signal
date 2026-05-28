insert into public.market_exchanges (
  country,
  exchange,
  name,
  display_name,
  currency,
  timezone,
  locale,
  is_active
) values
(
  'TW',
  'TWSE',
  'Taiwan Stock Exchange',
  '台灣證券交易所',
  'TWD',
  'Asia/Taipei',
  'zh-TW',
  true
),
(
  'TW',
  'TPEx',
  'Taipei Exchange',
  '櫃買中心',
  'TWD',
  'Asia/Taipei',
  'zh-TW',
  false
),
(
  'US',
  'NASDAQ',
  'Nasdaq Stock Market',
  'NASDAQ',
  'USD',
  'America/New_York',
  'en-US',
  false
),
(
  'US',
  'NYSE',
  'New York Stock Exchange',
  'NYSE',
  'USD',
  'America/New_York',
  'en-US',
  false
)
on conflict (country, exchange) do update set
  name = excluded.name,
  display_name = excluded.display_name,
  currency = excluded.currency,
  timezone = excluded.timezone,
  locale = excluded.locale,
  is_active = excluded.is_active,
  updated_at = now();
