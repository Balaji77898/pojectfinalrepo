export function formatTime(isoString: string | undefined | null): string {
    if (!isoString) return 'Unknown';

    try {
        const date = new Date(isoString);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }



        return new Intl.DateTimeFormat('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'UTC'
        }).format(date);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Error';
    }
}
