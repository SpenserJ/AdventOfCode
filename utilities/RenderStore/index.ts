import cloneDeep from 'clone-deep';

export type RenderRecord<T> = Partial<T> & {
  labels: Record<string, string | number>;
};

/* eslint-disable @typescript-eslint/no-unused-vars */
class RenderStoreStub<TRecord = {}> {
  public setLabel(labels: Record<string, string | number>): void;
  public setLabel(key: string, value: string | number): void;
  public setLabel(
    keyOrLabels: string | Record<string, string | number>,
    value?: string | number,
  ): void {}

  public unsetLabel(key: string): void {}

  public update(key: string, value: any): void {}

  public getData(): RenderRecord<TRecord>[] {
    throw new Error('Cannot call RenderStoreStub.getData()');
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

class RenderStore<TRecord = {}> extends RenderStoreStub<TRecord> {
  private data: RenderRecord<TRecord>[] = [];

  private activeLabels: Record<string, string | number> = {};

  public setLabel(labels: Record<string, string | number>): void;
  public setLabel(key: string, value: string | number): void;
  public setLabel(
    keyOrLabels: string | Record<string, string | number>,
    value?: string | number,
  ): void {
    if (typeof keyOrLabels === 'string') {
      if (typeof value !== 'undefined') {
        this.activeLabels[keyOrLabels] = value;
      }
    } else {
      Object.assign(this.activeLabels, keyOrLabels);
    }
  }

  public unsetLabel(key: string): void {
    delete this.activeLabels[key];
  }

  public update(key: string, value: any): void {
    if (Object.keys(this.activeLabels).length === 0) {
      console.log({ key, value, activeLabels: this.activeLabels });
      throw new Error('RenderStore requires that you set a label before proceeding');
    }

    const lastRecord = this.data[this.data.length - 1] || {};
    const newRecord = {
      ...lastRecord,
      labels: { ...this.activeLabels },
      [key]: cloneDeep(value, (toClone) => {
        if (typeof (toClone as any).clone === 'function') {
          return (toClone as any).clone();
        }
        return cloneDeep(value, true);
      }),
      // [key]: value,
    };
    this.data.push(newRecord as RenderRecord<TRecord>);
  }

  public getData(): RenderRecord<TRecord>[] {
    return this.data;
  }
}

export default (process.env.NEXT_PUBLIC_RENDER || process.env.RENDER)
  ? RenderStore
  : RenderStoreStub;
