import { Input } from 'antd'
import * as React from 'react'
import { usePersistFn } from 'yc-hooks'
import { useFormContext } from '../context'

export interface IFieldProps {
  name: string
}

const Field: React.FC<IFieldProps> = (props) => {
  const { name } = props
  const { subscribe, setFieldsChanged } = useFormContext()

  const [state, setState] = React.useState(void 0)

  React.useEffect(() => {
    const unsubscribe = subscribe({
      name,
      state,
      setState
    })

    return () => {
      unsubscribe()
    }
  }, [state])

  const handleChange = usePersistFn((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setFieldsChanged(true)

    setState(value)
  })

  return (
    <div style={{marginBottom: 8}}>
      <Input value={state ?? ''} onChange={handleChange} />
    </div>
  )
}

export default Field