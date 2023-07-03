const Table = ({ dataTable }) => {

    return (
        <table>
            <thead>
            <tr>
                <th>Employee ID 1</th>
                <th>Employee ID 2</th>
                <th>Project ID</th>
                <th>Days worked</th>
            </tr>
            </thead>
            <tbody>
            {dataTable?.map((row, index) => (
                <tr key={index}>
                    <td>{row.empl1}</td>
                    <td>{row.empl2}</td>
                    <td>{row.project.projectID}</td>
                    <td>{row.project.overlapDays}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default Table;