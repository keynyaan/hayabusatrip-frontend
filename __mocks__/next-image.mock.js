import * as NextImage from 'next/image'

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) => {
    const { priority, fill, ...restProps } = props
    return <img {...restProps} />
  },
})
