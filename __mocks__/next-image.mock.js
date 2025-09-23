// eslint-disable-next-line import/no-anonymous-default-export
export default function MockedNextImage(props) {
  const { priority, fill, ...restProps } = props
  return <img {...restProps} />
}
