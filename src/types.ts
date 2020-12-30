import { ValidationRule } from "antd/lib/form";

/** form 工具方法，类似antd */
export type TFormInstance = {
  getFieldValue: (name: string) => any
  getFieldsValue: () => any,
  setFieldsValue: (values: any) => void
  resetFields: () => void
  validateFields: (names?: string[]) => Promise<void>
  getInternalCallbacks?: (mark?: string) => TContextValue
}

/** field 订阅的方法 */
export type TSubscribe = (subscriber: TSubscriber<any>) => () => void

/** context 里的值 */
export type TContextValue = {
  subscribe: TSubscribe,
  setInitialValue: (initialValue: any) => void
  setFieldsChanged: (name: string, changed: boolean) => void
  getFieldChanged: (name: string) => boolean
}

/** 每个订阅总表单的field需要暴露的值 */
export type TSubscriber<T> = {
  name: string,
  state: T,
  setState: (state: T) => void
  validation: {
    rules: ValidationRule[]
    setStatus: (status: { status: TValidateStatus, explain?: string }) => void
  }
}

export type TValidateStatus = 'success' | 'warning' | 'error' | 'validating';