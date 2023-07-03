import { useState  } from 'react';
import Papa from "papaparse";
import moment from 'moment';
import Table from "./Table";

function FileUploader() {
    const [dataCSV, setDataCSV] = useState({})
    const [isFileLoaded, setIsFileLoaded] = useState(false)
    const [longestOverlaps, setLongestOverlaps] = useState({})

    const calculateOverlapDaysBetweenProjects = (project1, project2) => {
        let overlapDays = 0
        let fStart = moment(project1.dateFrom)
        let sStart = moment(project2.dateFrom);

        let fEnd = project1.dateTo !== 'NULL' ? moment(project1.dateTo) : moment();
        let sEnd = project2.dateTo !== 'NULL' ? moment(project2.dateTo) : moment();

        const startOverlap = moment.max(fStart, sStart);
        const endOverlap = moment.min(fEnd, sEnd);

        if (startOverlap.isBefore(endOverlap)) {
            overlapDays = endOverlap.diff(startOverlap, 'days') ;
        }
        console.log(overlapDays)
        return overlapDays;
    }

    const findLongestCommonProject = (employeesData) => {
        let longestCommonProjectDays = 0;
        let longestCommonProjectPair = null;
        let commonProjects = [];

        const employeeIds = Object.keys(employeesData);

        for (let i = 0; i < employeeIds.length; i++) {
            for (let j = i + 1; j < employeeIds.length; j++) {
                const emp1 = employeeIds[i];
                const emp2 = employeeIds[j];
                const projects1 = employeesData[emp1];
                const projects2 = employeesData[emp2];


                let totalOverlapDays = 0;
                let commonProjectsForPair = [];

                for (const proj1 of projects1) {
                    for (const proj2 of projects2) {
                        if (proj1.projectID === proj2.projectID) {
                            const overlapDays = calculateOverlapDaysBetweenProjects(proj1, proj2);
                            if (overlapDays) {
                                totalOverlapDays += overlapDays;
                                commonProjectsForPair.push({
                                    projectID: proj1.projectID,
                                    overlapDays: overlapDays,
                                });
                                break;
                            }
                        }
                    }
                }

                if (totalOverlapDays > longestCommonProjectDays) {
                    longestCommonProjectDays = totalOverlapDays;
                    longestCommonProjectPair = [emp1, emp2];
                    commonProjects = commonProjectsForPair;
                }
            }
        }

        return { longestCommonProjectPair, longestCommonProjectDays, commonProjects }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (result) => {
                    const data = result.data;
                    const updatedData = {};
                    data.forEach((entry) => {
                        const {EmpID: empID, ProjectID: projectID, DateFrom: dateFrom, DateTo: dateTo} = entry
                        if (empID) {
                            if (!updatedData[empID]) {
                                updatedData[empID] = []
                            }
                            updatedData[empID].push({
                                projectID,
                                dateFrom,
                                dateTo
                            })
                        }
                    });

                    setDataCSV(updatedData);
                    setIsFileLoaded(true);
                    const longetOverlapObj = findLongestCommonProject(updatedData);
                    const displayObj = [];
                    for (let i = 0; i < longetOverlapObj['commonProjects'].length; i++) {
                        displayObj.push({
                            'project': longetOverlapObj['commonProjects'][i],
                            'empl1': longetOverlapObj['longestCommonProjectPair'][0],
                            'empl2': longetOverlapObj['longestCommonProjectPair'][1],
                            'days': longetOverlapObj['longestCommonProjectDays'],
                        })
                    }

                    setLongestOverlaps(displayObj)

                },

            });
        }
    };

    return (
            <div>
                <input type="file" onChange={handleFileChange} accept=".csv" />
                {isFileLoaded && longestOverlaps && <Table dataTable={longestOverlaps} /> }
            </div>
     )
}

export default FileUploader;


