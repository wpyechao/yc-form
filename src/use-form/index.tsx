import * as React from 'react';
import { TFormInstance, TSubscriber } from '../types';
import set from 'lodash.set'

/** internal mark */
export const INTERNAL_MARK = 'INTERNAL_MARK'

class FormStore {
  /** 所有订阅的 field */
  private Subscribers: Set<TSubscriber<any>>

  /** 初始值 */
  private initialValues: any = null

  /** 是否有field 手动触发过了 */
  private fieldsChanged: boolean = false

  constructor() {
    this.Subscribers = new Set()
  }

  /** 每个field 进行订阅的函数 返回值为取消订阅 */
  private subscribe = (subscriber: TSubscriber<any>) => {
    this.Subscribers.add(subscriber)

    return () => {
      this.Subscribers.delete(subscriber)
    }
  }

  /** 通知field 进行更新 */
  private notifyField = (name: string, state: any) => {
    let field: TSubscriber<any> = null
    this.Subscribers.forEach((s) => {
      if(s.name === name) {
        field = s
      }
    })
    if(field)
      field.setState(state)
  }

  /** 获取单个name的value */
  private getFieldValue: TFormInstance['getFieldValue'] = (name) => {
    for (const subscriber of this.Subscribers) {
      if(subscriber.name === name) {
        return subscriber.state
      }
    }
    return
  }

  /** 获取所有values */
  private getFieldsValue: TFormInstance['getFieldsValue'] = () => {
    const value = {}
    for (const subscriber of this.Subscribers) {
      const { name, state } = subscriber
      set(value, name, state)
    }
    return value
  }

  /** setFields */
  private setFieldsValue: TFormInstance['setFieldsValue'] = (values) => {
    Object.keys(values || {}).forEach((key) => {
      this.notifyField(key, values[key])
    })
  }

  /** reset */
  private resetFields: TFormInstance['resetFields'] = () => {
    this.setFieldsValue(this.initialValues)
  }

  /** 获取内部的一些方法， 只能在内部调用 */
  private getInternalCallbacks: TFormInstance['getInternalCallbacks'] = (mark) => {
    // 内部调用传入 mark
    if(mark === INTERNAL_MARK) {
      return {
        subscribe: this.subscribe,
        getFieldsChanged: () => this.fieldsChanged,
        setFieldsChanged: (changed) => this.fieldsChanged = changed,
        setInitialValue: (initialValues) => {
          if(!this.fieldsChanged) {
            this.initialValues = initialValues
            this.setFieldsValue(initialValues)
          }
        }
      }
    }
    return null
  }

  /** 获取 form instance */
  public getFormInstance = (): TFormInstance => {
    return {
      getFieldValue: this.getFieldValue,
      getFieldsValue: this.getFieldsValue,
      setFieldsValue: this.setFieldsValue,
      resetFields: this.resetFields,
      getInternalCallbacks: this.getInternalCallbacks
    }
  }
}

const useForm = (instance?: TFormInstance) => {
  const instanceRef = React.useRef<TFormInstance>(null)

  if(instance) return [instance]

  if(!instanceRef.current) {
    instanceRef.current = new FormStore().getFormInstance()
  }

  return [instanceRef.current]
}

export default useForm