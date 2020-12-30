import * as React from 'react';
import { TContextValue } from '../types';
declare const FormProvider: React.Provider<TContextValue>;
/** 获取表单context */
declare const useFormContext: () => TContextValue;
export { FormProvider, useFormContext };
