import { FormItemProps } from 'antd/lib/form';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import * as React from 'react';
export interface IFieldProps extends FormItemProps, Omit<GetFieldDecoratorOptions, 'getValueProps' | 'normalize' | 'preserve' | 'trigger'> {
    name: string;
}
declare const Field: React.FC<IFieldProps>;
export default Field;
