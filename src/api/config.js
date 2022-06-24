export const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
    'Content-Type': 'application/json'
  }
}
