export default function raise(message, data = null) {
  console.error(message, data)
  throw new Error(message)
}