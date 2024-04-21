<script>
    import {
        Chart,
        Card,
        A,
        Button,
        Dropdown,
        DropdownItem,
        Popover,
        Tooltip,
        Select,
        WidgetPlaceholder
    } from 'flowbite-svelte';
    import {
        InfoCircleSolid,
        ChevronDownOutline,
        ChevronRightOutline,
        PenSolid,
        DownloadSolid,
        ShareNodesSolid,
        TrashBinSolid,
        DotsHorizontalOutline,
        ArrowDownToBracketOutline
    } from 'flowbite-svelte-icons';
    import Header from "../lib/Header.svelte";
    import {onMount} from "svelte";
    import {parseJwt} from "../lib/utils.js";
    import {navigate} from "svelte-routing";


    let options = {
        series: [35.1, 23.5, 2.4, 5.4],
        colors: ['#ef9b20', '#27aeef', '#bdcf32', '#ea5545'],
        chart: {
            height: 320,
            width: '100%',
            type: 'donut'
        },
        stroke: {
            colors: ['transparent'],
            lineCap: ''
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontFamily: 'Inter, sans-serif',
                            offsetY: 20
                        },
                        total: {
                            showAlways: true,
                            show: true,
                            label: 'Počet požadavků',
                            fontFamily: 'Inter, sans-serif',
                            formatter: function (w) {
                                const sum = w.globals.seriesTotals.reduce((a, b) => {
                                    return a + b;
                                }, 0);
                                return `${sum}`;
                            }
                        },
                        value: {
                            show: true,
                            fontFamily: 'Inter, sans-serif',
                            offsetY: -20,
                            formatter: function (value) {
                                return value;
                            }
                        }
                    },
                    size: '80%'
                }
            }
        },
        grid: {
            padding: {
                top: -2
            }
        },
        labels: ['Nový', 'V řešení', 'Vyřešen', 'Neplatný'],
        dataLabels: {
            enabled: false
        },
        legend: {
            position: 'bottom',
            fontFamily: 'Inter, sans-serif'
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value;
                }
            }
        },
        xaxis: {
            labels: {
                formatter: function (value) {
                    return value;
                }
            },
            axisTicks: {
                show: false
            },
            axisBorder: {
                show: false
            }
        }
    }

    let chart2 = {
        chart: {
            colors: ['#1A56DB', '#FDBA8C'],
            series: [
                {
                    name: 'Počet nově založených požadavků',
                    color: '#FDBA8C',
                    data: [
                        {x: 'Mon', y: 232},
                        {x: 'Tue', y: 113},
                        {x: 'Wed', y: 341},
                        {x: 'Thu', y: 224},
                        {x: 'Fri', y: 522},
                        {x: 'Sat', y: 411},
                        {x: 'Sun', y: 243}
                    ]
                }
            ],
            chart: {
                type: 'bar',
                height: '320px',
                fontFamily: 'Inter, sans-serif',
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '70%',
                    borderRadiusApplication: 'end',
                    borderRadius: 8
                }
            },
            tooltip: {
                shared: true,
                intersect: false,
                style: {
                    fontFamily: 'Inter, sans-serif'
                }
            },
            states: {
                hover: {
                    filter: {
                        type: 'darken',
                        value: 1
                    }
                }
            },
            stroke: {
                show: true,
                width: 0,
                colors: ['transparent']
            },
            grid: {
                show: false,
                strokeDashArray: 4,
                padding: {
                    left: 2,
                    right: 2,
                    top: -14
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            xaxis: {
                floating: false,
                labels: {
                    show: true,
                    style: {
                        fontFamily: 'Inter, sans-serif',
                        cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                    }
                },
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                }
            },
            yaxis: {
                show: false
            },
            fill: {
                opacity: 1
            }
        }
    }

    let chart3 = {
        chart: {
            series: [52.8, 26.8, 20.4],
            colors: ['#fd7f6f', '#7eb0d5', '#b2e061', '#bd7ebe', '#ffb55a', '#ffee65'],
            chart: {
                height: 420,
                width: '100%',
                type: 'pie'
            },
            stroke: {
                colors: ['white'],
                lineCap: ''
            },
            plotOptions: {
                pie: {
                    labels: {
                        show: true
                    },
                    size: '100%',
                    dataLabels: {
                        offset: -25
                    }
                }
            },
            labels: ['Intranet', 'Software', 'Majetek', 'Hardware','Oprávnění', 'Jiné'],
            dataLabels: {
                enabled: true,
                style: {
                    fontFamily: 'Inter, sans-serif'
                }
            },
            legend: {
                position: 'bottom',
                fontFamily: 'Inter, sans-serif'
            },
            yaxis: {
                labels: {
                    formatter: function (value) {
                        return value;
                    }
                }
            },
            xaxis: {
                labels: {
                    formatter: function (value) {
                        return value;
                    }
                },
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                }
            }
        }
    }

    let jwt = localStorage.getItem("jwt")
    let requestsByDates = {};

    function fetchCountsByState(){
        return fetch(import.meta.env.VITE_BE_URL+"/request/count-by-state", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + `${jwt}`
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // This returns a promise
            })
            .then(data => {
                let order = ["NEW", "IN_PROGRESS", "SOLVED", "INVALID"];
// Map the data right after it is received
                options.series = order.map(key => data[key] !== undefined ? data[key] : 0);
                console.log(data);
                return options.series; // Return the requests
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function fetchCountByCategory(){
        return fetch(import.meta.env.VITE_BE_URL+"/request/count-by-category", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + `${jwt}`
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // This returns a promise
            })
            .then(data => {
                let order = ["INTRANET", "SOFTWARE", "PROPERTY", "HARDWARE", "PERMISSION", "OTHER"];
                // Map the data right after it is received
                chart3.chart.series = order.map(key => data[key] !== undefined ? data[key] : 0);
                console.log(data);
                return options.series; // Return the requests
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function fetchCountByDate(){
        return fetch(import.meta.env.VITE_BE_URL+"/request/count-by-date", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + `${jwt}`
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // This returns a promise
            })
            .then(data => {
                // Map the data right after it is received
                requestsByDates = data;
                console.log(data);
                return options.series; // Return the requests
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    onMount(() => {
            fetchCountsByState();
            fetchCountByCategory();
            fetchCountByDate().then(() => {
                filterDates();
            });
    })

    function filterDates() {
        console.log(selectedDateFilter)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set the time to 00:00:00.000

        const filteredData = {};

        for (const [date, value] of Object.entries(requestsByDates)) {
            const dateObj = new Date(date);

            // Calculate the difference in days
            const diffInDays = Math.floor((today - dateObj) / (1000 * 60 * 60 * 24));

            if (diffInDays < selectedDateFilter) {
                filteredData[date] = value;
            }
        }
        chart2.chart.series[0].data = Object.entries(filteredData).map(([date, value]) => {
            return {x: date, y: value};
        });
        chart2.chart.series[0].data.sort((a, b) => {
            const dateA = new Date(a.x);
            const dateB = new Date(b.x);

            return dateA - dateB;
        });

    }
    let dateFilters = [
        { value: '0', name: 'Dnes' },
        { value: '1', name: 'Včera' },
        { value: '7', name: 'Posledních 7 dnů' },
        { value: '30', name: 'Posledních 30 dnů' },
        { value: '90', name: 'Posledních 90 dnů' }
    ];
    let selectedDateFilter = '7'

</script>
<Header></Header>
{#if parseJwt(localStorage.getItem("jwt")).role === "ADMIN"}
    <div class="grid grid-cols-3 justify-items-center mt-5">


    <Card class="max-h-fit">
        <div class="flex justify-between items-start w-full">
            <div class="flex-col items-center">
                <div class="flex items-center mb-1">
                    <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white me-1">Počet požadavku dle stavu</h5>
                </div>
            </div>
        </div>

        <Chart {options} class="py-6" />


    </Card>

    <Card>
        <div class="flex justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center align-middle">
                <div>
                    <h5 class="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">Počet nových požadavků</h5>
                    <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Přehled počtu zadaných požadavků</p>
                </div>
            </div>
            <div>

            </div>
        </div>

        {#each Object.values(chart2) as options}
            <Chart {options} class="py-6" />
        {/each}
        <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
            <div class="flex justify-between items-center pt-5">
                <Select on:change={filterDates} class="mt-2 mb-1 focus:border-blue-700 focus:ring-blue-700" items={dateFilters} bind:value={selectedDateFilter} placeholder="Období"/>
            </div>
        </div>
    </Card>

    <Card>
        <div class="flex justify-between items-start w-full">
            <div class="flex-col items-center">
                <div class="flex items-center mb-1">
                    <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white me-1">Počet požadavků dle kategorie</h5>
                </div>
            </div>
            <div class="flex justify-end items-center">
            </div>
        </div>

        {#each Object.values(chart3) as options}
            <Chart {options} class="py-6" />
        {/each}

    </Card>

</div>
    {:else}
    <div class="page-content mt-[25]">
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div class="mx-auto max-w-screen-sm text-center">
                <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-red-600 dark:text-primary-500">401</h1>
                <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Stala se chyba...</p>
                <Button on:click={() => navigate("/requests")} class="mt-1.5 bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0" type="submit">Zpátky na domovskou stránku</Button>
            </div>
        </div>
    </div>

    {/if}
