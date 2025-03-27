export async function initMsw() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  if (typeof window === 'undefined') {
    const { server } = await import('./http');
    server.listen();
  } else {
    const { worker } = await import('./browser');
    await worker.start();
  }
}
