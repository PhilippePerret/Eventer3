export default class ItemRepository {

  static async save(item, lister) {
    const response = await fetch(`/data/${lister.dataFolder}/${item.id}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    })
    if (!response.ok) throw new Error(`Impossible de sauver ${item.id}`)
  }

}