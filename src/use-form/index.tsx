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
  private fieldsChanged: { [key: string]: boolean } = {}

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
    for (const s of this.Subscribers) {
      if(s.name === name) {
        s.setState(state)
        return
      }
    }
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

  /** 获取一个field 是否已经手动触发过 */
  private getFieldChanged = (name: string) => {
    return !!this.fieldsChanged[name]
  }

  /** 获取内部的一些方法， 只能在内部调用 */
  private getInternalCallbacks: TFormInstance['getInternalCallbacks'] = (mark) => {
    // 内部调用传入 mark
    if(mark === INTERNAL_MARK) {
      return {
        subscribe: this.subscribe,
        setFieldsChanged: (name, changed) => this.fieldsChanged[name] = changed,
        getFieldChanged: this.getFieldChanged,
        setInitialValue: (initialValues) => {
          this.initialValues = initialValues
          Object.keys(initialValues || {}).forEach((key) => {
            if(!this.getFieldChanged(key)) {
              this.notifyField(key, initialValues[key])
            }
          })
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