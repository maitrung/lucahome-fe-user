import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Text } from '@mantine/core';
import {
    QueryClient,
    QueryClientProvider,
    useInfiniteQuery,
} from '@tanstack/react-query';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';

const columns = [
    {
        accessorKey: 'date1',
        header: 'Thứ',
        maxSize: 60
    },
    {
        accessorKey: 'date2',
        header: 'Ngày',
        maxSize: 120
    },
    {
        accessorKey: 'time1',
        header: '11:00 - 14:00',
        Cell: ({ cell, row }) => (
            cell.getValue() === 'true' ? (
                <span >
                    Còn trống
                </span>
            ) : (<span>
                Đã đặt
            </span>)

        ),
        maxSize: 120
    },
    {
        accessorKey: 'time2',
        header: '14:30 - 17:30',
        Cell: ({ cell, row }) => (
            cell.getValue() === 'true' ? (
                <span >
                    Còn trống
                </span>
            ) : (<span>
                Đã đặt
            </span>)

        ),
        maxSize: 120
    },
    {
        accessorKey: 'time3',
        header: '18:00 - 21:00',
        Cell: ({ cell, row }) => (
            cell.getValue() === 'true' ? (
                <span >
                    Còn trống
                </span>
            ) : (<span>
                Đã đặt
            </span>)

        ),
        maxSize: 120
    },
    {
        accessorKey: 'time4',
        header: 'Qua đêm 21:30',
        Cell: ({ cell, row }) => (
            cell.getValue() === 'true' ? (
                <span >
                    Còn trống
                </span>
            ) : (<span>
                Đã đặt
            </span>)
        ),
        maxSize: 120
    },
];

const fetchSize = 10;

const Example = (props) => {
    const [roomId, setRoomId] = useState(null);
    const [from, setFrom] = useState(null);

    const tableContainerRef = useRef(null); //we can get access to the underlying TableContainer element and react to its scroll events
    // const rowVirtualizerInstanceRef = useRef(null); //we can get access to the underlying Virtualizer instance and call its scrollToIndex method

    const { data, fetchNextPage, isFetching, isLoading } =
        useInfiniteQuery({
            queryKey: ['table-data'],
            queryFn: async ({ pageParam = 0 }) => {
                const space = (pageParam - 1) * fetchSize;
                const fromDate = moment(from).add(space, 'days');
                const data = {
                    roomId,
                    from: moment(fromDate).toISOString(),
                    to: moment(fromDate).add(fetchSize - 1, 'days').toISOString()
                }

                let response = await axios.post(`${process.env.REACT_APP_URL_BACKEND || 'https://luca-home.vercel.app'}/room/checkAvailable`, data);
                response = response?.data
                let result = [];
                if (response?.code === 1000) {
                    result = response?.data?.[0]?.dateAvailable || [];
                }
                return result;
            },
            getNextPageParam: (_lastGroup, groups) => groups.length,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        });

    const flatData = useMemo(
        () => {
            const covertDayOfWeek = (dayOfWeek) => {
                const convertedValue = (parseInt(dayOfWeek, 10)) % 7;
                return convertedValue === 0 ? 'CN' : (convertedValue + 1).toString();
            }

            const result = [];
            _.forEach(_.flatMap(data?.pages), (item) => {
                // const data = [];
                result.push({
                    date1: covertDayOfWeek(moment(item?.date).format('e')),
                    date2: moment(item?.date).format('DD-MM-YYYY'),
                    time1: `${item?.bookingTimeSlots?.[0]?.isAvailable ? 'true' : ''}`,
                    time2: `${item?.bookingTimeSlots?.[1]?.isAvailable ? 'true' : ''}`,
                    time3: `${item?.bookingTimeSlots?.[2]?.isAvailable ? 'true' : ''}`,
                    time4: `${item?.bookingTimeSlots?.[3]?.isAvailable ? 'true' : ''}`,
                });
            })
            return result;
        },
        [data],
    );

    //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement) => {
            if (containerRefElement) {
                const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
                //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
                if (
                    scrollHeight - scrollTop - clientHeight < 400 &&
                    !isFetching
                ) {
                    fetchNextPage();
                }
            }
        },
        [fetchNextPage, isFetching],
    );

    useEffect(() => {
        setRoomId(props?.data?.roomId);
        setFrom(moment(props?.data?.from));
    }, []);

    useEffect(() => {
        fetchMoreOnBottomReached(tableContainerRef.current);
    }, [fetchMoreOnBottomReached]);

    const table = useMantineReactTable({
        columns,
        data: flatData,
        enablePagination: false,
        enableGlobalFilter: false,
        enableColumnFilters: false,
        enableHiding: false,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        enableSorting: false,
        enableStickyHeader: true,
        enableColumnActions: false,
        initialState: {
            columnPinning: {
                left: ['date1', 'date2'], //pin email column to left by default
            }
        },
        enableRowNumbers: false,
        enableRowVirtualization: true, //optional, but recommended if it is likely going to be more than 100 rows
        manualFiltering: false,
        manualSorting: false,
        mantineTableContainerProps: {
            ref: tableContainerRef, //get access to the table container element
            sx: { maxHeight: '600px' }, //give the table a max height
            onScroll: (
                event, //add an event listener to the table container element
            ) => fetchMoreOnBottomReached(event.target),
        },
        state: {
            // columnFilters,
            isLoading
        },
        // rowVirtualizerInstanceRef, //get access to the virtualizer instance
        rowVirtualizerProps: { overscan: 10 },
    });

    return roomId && (<MantineReactTable table={table} />);
};

const queryClient = new QueryClient();

const ExampleWithReactQueryProvider = (props) => {
    const data = {
        roomId: props?.data?.roomId,
        from: props?.data?.from,
        to: props?.data?.to,
    }
    // console.log('data', data);

    return <QueryClientProvider client={queryClient}>
        <Example data={data} />
    </QueryClientProvider>
};

export default ExampleWithReactQueryProvider;