const dateRender = (val) => {
    const date = new Date(val);
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
    return (
        formattedDate
    );
}
export default dateRender;