import React from 'react'
import { MultiCascader } from 'rsuite';
import { BlMultiCascaderProps } from './index.type';
import './index.less'


export const BlMultiCascader: React.FC<BlMultiCascaderProps> = (props) => {


    return (
        <div>
            <MultiCascader {...props} />
        </div>
    )
}


