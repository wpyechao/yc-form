import * as React from 'react';
import { TFormInstance } from '../types';
declare type TFormProps = {
    form?: TFormInstance;
    initialValues?: any;
    onSubmit?: (values: any) => void;
};
declare const Form: React.FC<TFormProps>;
export default Form;
