/** form 工具方法，类似antd */
export type TFormInstance = {
  getFieldValue: (name: string) => any
  getFieldsValue: () => any,
  setFieldsValue: (values: any) => void
  resetFields: () => void
  getInternalCallbacks?: (mark?: string) => {
    subscribe: TSubscribe,
    setFieldsChanged: (name: string, changed: boolean) => void,
    getFieldChanged: (name: string) => boolean
    setInitialValue: (initialValue: any) => void
  }
}

/** field 订阅的方法 */
export type TSubscribe = (subscriber: TSubscriber<any>) => () => void

/** context 里的值 */
export type TContextValue = {
  subscribe: TSubscribe,
  setFieldsChanged: (name: string, changed: boolean) => void
  getFieldChanged: (name: string) => boolean
}

/** 每个订阅总表单的field需要暴露的值 */
export type TSubscriber<T> = {
  name: string,
  state: T,
  setState: (state: T) => void
}