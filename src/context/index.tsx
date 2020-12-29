import * as React from 'react';
import { TContextValue, TSubscriber } from '../types';

const Context = React.createContext({} as TContextValue)
Context.displayName = 'YCForm'

const { Provider: FormProvider } = Context

/** 获取表单context */
const useFormContext = () => React.useContext(Context)

export { 
  FormProvider,
  useFormContext
} 
