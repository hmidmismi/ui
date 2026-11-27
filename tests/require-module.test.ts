import { afterEach, describe, expect, it, vi } from 'vitest';

/** Runs `requireModule` in a page whose stylesheet says it includes `included`. */
async function run(included: string, name: 'forms' | 'admin' | 'catalog') {
  vi.resetModules();
  vi.stubGlobal('document', { documentElement: {} });
  vi.stubGlobal('getComputedStyle', () => ({ getPropertyValue: () => included }));
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  const { requireModule } = await import('../src/hooks/require-module');
  requireModule(name);
  requireModule(name);
  return error;
}

describe('requireModule', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('says once that a module the preset left out has no CSS', async () => {
    const error = await run('forms', 'catalog');
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0]?.[0]).toContain('"catalog"');
  });

  it('is quiet when the module is included', async () => {
    expect(await run('forms catalog', 'catalog')).not.toHaveBeenCalled();
  });

  it('is quiet when the stylesheet does not say', async () => {
    expect(await run('', 'catalog')).not.toHaveBeenCalled();
  });
});
