export function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

export function isEmptyArray(arg: unknown): boolean {
  return Array.isArray(arg) && arg.length === 0;
}

export function parseBoolean(str: string): boolean | undefined {
  if (str === 'true') return true;
  if (str === 'false') return false;
  return undefined;
}

export function selectFiles(options: Partial<HTMLInputElement> = {}): Promise<FileList | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');

    Object.assign(input, {
      type: 'file',
      ...options,
    });

    input.addEventListener('change', () => {
      resolve(input.files);
    });

    setTimeout(() => {
      input.dispatchEvent(new MouseEvent('click'));
    }, 0);
  });
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
