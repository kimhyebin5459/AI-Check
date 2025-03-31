export async function initMsw() {
  if (typeof window === 'undefined') {
    const { server } = await import('./http');
    server.listen();
  } else {
    const { worker } = await import('./browser');
    await worker.start();
  }
}
