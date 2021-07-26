import React, { useState } from 'react'
import { MultiCascader } from 'rsuite';
import { BlMultiCascaderProps } from './index.type';
import './index.less'


export const BlMultiCascader: React.FC<BlMultiCascaderProps> = (props) => {
    const { value, defaultValue, onChange } = props;
    const [blvalue, setBlvalue] = useState(value)


    const handleChange = (value, event) => {
        setBlvalue(value);
        onChange && onChange(value, event)
    }


    return (
        <div>
            <MultiCascader
                {...props}
                value={blvalue ? blvalue : defaultValue}
                onChange={(value, event) => handleChange(value, event)}
            />
        </div>
    )
}


