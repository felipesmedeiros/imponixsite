// Continue a bounded cloud Steam download while preserving each dashboard's API.
const nativeFetch = window.fetch.bind(window);
window.fetch = async (input, init) => {
  let response = await nativeFetch(input, init);
  if (typeof input !== 'string' || !/^\/observatory\/(gsc|noema|photoncytosis)\/api\/refresh(?:\?|$)/.test(input) || init?.method !== 'POST') return response;
  for (let attempt = 0; response.status === 202 && attempt < 20; attempt++) {
    const job = await response.json();
    if (!job.jobId) throw new Error('Steam download could not continue. Reload and try again.');
    await new Promise(resolve => setTimeout(resolve, 250));
    const url = new URL(input, location.origin);
    url.searchParams.set('job', job.jobId);
    response = await nativeFetch(url, init);
  }
  if (response.status === 202) throw new Error('Steam download is still pending. Try again shortly.');
  return response;
};
