const PW = 'lego240706';

export async function onRequestGet(context) {
  const entries = await context.env.JOURNAL_ENTRIES.get('all_entries');
  return new Response(entries || '{}', {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPut(context) {
  const { password, date, content } = await context.request.json();
  if (password !== PW) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  }

  const raw = await context.env.JOURNAL_ENTRIES.get('all_entries');
  const entries = raw ? JSON.parse(raw) : {};

  if (content && content.trim()) {
    entries[date] = content;
  } else {
    delete entries[date];
  }

  await context.env.JOURNAL_ENTRIES.put('all_entries', JSON.stringify(entries));
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestDelete(context) {
  const { password, date } = await context.request.json();
  if (password !== PW) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  }

  const raw = await context.env.JOURNAL_ENTRIES.get('all_entries');
  const entries = raw ? JSON.parse(raw) : {};
  delete entries[date];

  await context.env.JOURNAL_ENTRIES.put('all_entries', JSON.stringify(entries));
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
