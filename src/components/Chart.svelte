<canvas id="myChart" width="1000px" height="200px"></canvas>
<script>
    import {
        Chart,
        ArcElement,
        LineElement,
        BarElement,
        PointElement,
        BarController,
        BubbleController,
        DoughnutController,
        LineController,
        PieController,
        PolarAreaController,
        RadarController,
        ScatterController,
        CategoryScale,
        LinearScale,
        LogarithmicScale,
        RadialLinearScale,
        TimeScale,
        TimeSeriesScale,
        Decimation,
        Filler,
        Legend,
        Title,
        Tooltip,
        SubTitle
    } from 'chart.js';

    Chart.register(
        ArcElement,
        LineElement,
        BarElement,
        PointElement,
        BarController,
        BubbleController,
        DoughnutController,
        LineController,
        PieController,
        PolarAreaController,
        RadarController,
        ScatterController,
        CategoryScale,
        LinearScale,
        LogarithmicScale,
        RadialLinearScale,
        TimeScale,
        TimeSeriesScale,
        Decimation,
        Filler,
        Legend,
        Title,
        Tooltip,
        SubTitle
    );
	import { onMount } from 'svelte';
    import * as fs from 'fs/promises';
    import path from 'path';

    const __dirname = path.resolve()
    console.log(__dirname);

    // async function getLabels() {
    //     var labels = [];
    //     var DBFile = await fs.readFile(path.join(__dirname, "users.json"), "utf-8")
    //     try {
    //         DBFile = JSON.parse(DBFile);
    //     } catch(e) {
    //         console.log("Error parsing Database file")
    //     }
        
    //     for (var i = 0; i < DBFile.length; i++){
    //         var obj = DBFile[i];
    //         labels.push(obj["token"]);
    //     }
    // }
    // await getLabels()

    async function CreateChart() {
        var config = {
            type: 'line',
            data: {
                labels: [1,1,1,1,1,1,1,1,1,1,1,1],
                datasets: [{
                    label: "CPU usage",
                    data: [2,11,111,1111,11111,111111,1111111,1111111,1111111111,11111111111111],
                    fill: false,
                    borderColor: "#bae755",
                    borderWidth : 0.7,
                    backgroundColor: "#bae755",
                    tension: 0,
                    pointRadius: 1,
                    pointHitRadius: 300
                }],
            },
            
            options: {
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: "xy"
                        },
                        limits: {
                            y: {min: 0, max: 100},
                        },
                        zoom: {
                            wheel: {
                                enabled: true
                            }
                        }
                    }
                },
                animation: true,
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 100
                    }
                }
            }
        }
                
            var ctx = document.getElementById("myChart").getContext("2d");
            var cpuchartelement = new Chart(ctx, config);
    }

    onMount(CreateChart)
</script>