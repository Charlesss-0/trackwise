export function formatDate(date: string): string {
	const [year, month, day] = date.split('-')

	return `${day} ${new Date(`${year}-${month}-${day}`).toLocaleString('default', {
		month: 'long',
	})} ${year}`
}
