export default class ListerRepository {

  static async save(lister) {
    const response = await fetch(`/data/${lister.id}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_ids: lister.item_ids
      })
    })
    if (!response.ok) throw new Error(`Impossible de sauver ${lister.id}`)
  }

}