const mockData = {
    users: [
        {
            id: "id1",
            email: "farmer@example.com",
            name: "John Farmer",
            contact: "010-1234-5678",
            createdAt: "2023-10-06T12:00:00.000Z",
            updatedAt: "2023-10-06T12:00:00.000Z",
            roles: [
                {
                    id: "role1",
                    userId: "id1",
                    role: "FARMER",
                    isActive: true,
                    createdAt: "2023-10-06T12:00:00.000Z",
                    updatedAt: "2023-10-06T12:00:00.000Z",
                },
            ],
        },
        {
            id: "id2",
            email: "worker@example.com",
            name: "Alice Worker",
            contact: "010-9876-5432",
            createdAt: "2023-10-06T12:00:00.000Z",
            updatedAt: "2023-10-06T12:00:00.000Z",
            roles: [
                {
                    id: "role2",
                    userId: "id2",
                    role: "WORKER",
                    isActive: true,
                    createdAt: "2023-10-06T12:00:00.000Z",
                    updatedAt: "2023-10-06T12:00:00.000Z",
                },
            ],
        },
    ],
    farms: [
        {
            id: "farm1",
            ownerId: "id1",
            name: "Sunny Farm",
            description: "A beautiful farm located in the countryside.",
            latitude: 35.6895,
            longitude: 139.6917,
            address: "123 Farm Road, Countryside",
            createdAt: "2023-10-06T12:00:00.000Z",
            updatedAt: "2023-10-06T12:00:00.000Z",
        },
    ],
    jobPostings: [
        {
            id: "job1",
            type: "FARMER",
            userId: "id1",
            farmId: "farm1",
            title: "Harvest Season Helper Needed",
            description:
                "We are looking for experienced season workers during the harvest season.",
            workDate: {
                start: "2025-09-01T00:00:00.000Z",
                end: "2025-09-30T00:00:00.000Z",
            },
            payment: {
                amount: 150,
                unit: "DAY",
            },
            status: "OPEN",
            createdAt: "2023-10-06T12:00:00.000Z",
            updatedAt: "2023-10-06T12:00:00.000Z",
        },
        {
            id: "job2",
            type: "WORKER",
            userId: "id2",
            farmId: null,
            title: "Looking for Farm Work",
            description:
                "I have past experience in farm work and I am available for seasonal tasks.",
            workDate: {
                start: "2025-08-15T00:00:00.000Z",
                end: "2025-08-20T00:00:00.000Z",
            },
            payment: {
                amount: 100,
                unit: "DAY",
            },
            status: "OPEN",
            createdAt: "2023-10-06T12:00:00.000Z",
            updatedAt: "2023-10-06T12:00:00.000Z",
        },
    ],
    JobPostingDetail: {
        id: "job-001",
        type: "FARMER",
        title: "더미 수확 도우미 필요",
        description:
            "이것은 테스트 목적으로 작성된 더미 구인 게시물 설명입니다.",
        author: {
            id: "author-001",
            name: "John Farmer",
            profileImage: "",
        },
        workDate: {
            start: "2025-09-01T00:00:00.000Z",
            end: "2025-09-30T00:00:00.000Z",
        },
        payment: {
            amount: 150,
            unit: "DAY",
        },
        location: {
            address: "123 농장 도로, 시골",
            latitude: 35.6895,
            longitude: 139.6917,
            farmName: "햇살 농장",
        },
        status: "OPEN",
        matchStatus: "PENDING",
        applicants: {
            total: 5,
            accepted: 2,
        },
        createdAt: "2023-10-06T12:00:00.000Z",
        updatedAt: "2023-10-06T12:00:00.000Z",
    },
    matches: [
        {
            id: "match1",
            jobPostingId: "job1",
            workerId: "id2",
            status: "PENDING",
            message:
                "I am interested in assisting during the harvest season. Please consider my application.",
            appliedAt: "2023-10-06T12:00:00.000Z",
            updatedAt: "2023-10-06T12:00:00.000Z",
            completedAt: null,
        },
    ],
};

export default mockData;
