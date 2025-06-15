import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CompletionChart = ({ tasks }) => {
    if (!tasks || !Array.isArray(tasks)) {
        console.error('Invalid tasks prop:', tasks);
        return <div>Error: Invalid tasks data</div>;
    }

    const completionCounts = { low: 0, medium: 0, high: 0 };

    tasks.forEach((task) => {
        if (task.completed) {
            const level = task.energy_level?.toLowerCase();
            if (completionCounts[level] !== undefined) {
                completionCounts[level]++;
            }
        }
    });

    const data = {
        labels: ['Low', 'Medium', 'High'],
        datasets: [
            {
                label: '# of Completions',
                data: [
                    completionCounts.low,
                    completionCounts.medium,
                    completionCounts.high,
                ],
                backgroundColor: ['#8BC34A', '#FFC107', '#F44336'],
                borderColor: ['#7CB342', '#FFB300', '#E53935'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    return (
        <div className="w-80 mx-auto mt-8">
            <h2 className="text-center text-lg font-semibold mb-4">
                Completed Tasks by Energy Level
            </h2>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default CompletionChart;