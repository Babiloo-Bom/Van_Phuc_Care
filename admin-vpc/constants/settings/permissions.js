export const PERMISSIONS = [
    {
        title: 'Khách hàng',
        childrent: [
            {
                title: 'Danh sách khách hàng',
                value: 'partners',
                childrent: [
                    {
                        label: 'Xem',
                        value: 'customers.view',
                    },
                    {
                        label: 'Chỉnh sửa',
                        value: 'customers.update',
                    },
                    {
                        label: 'Xóa',
                        value: 'customers.delete',
                    },
                    {
                        label: 'Thêm mới',
                        value: 'customers.create',
                    },
                ],
            },
            {
                title: 'Danh mục khách hàng',
                value: 'partners/categories',
                childrent: [
                    {
                        label: 'Xem',
                        value: 'partners/categories.view',
                    },
                    {
                        label: 'Chỉnh sửa',
                        value: 'partners/categories.update',
                    },
                    {
                        label: 'Xóa',
                        value: 'partners/categories.delete',
                    },
                    {
                        label: 'Thêm mới',
                        value: 'partners/categories.create',
                    },
                ],
            },
        ],
    },
    {
        title: 'Sản phẩm',
        childrent: [
            {
                title: 'Danh sách sản phẩm',
                value: 'products',
                childrent: [
                    {
                        label: 'Xem',
                        value: 'products.view',
                    },
                    {
                        label: 'Chỉnh sửa',
                        value: 'products.update',
                    },
                    {
                        label: 'Xóa',
                        value: 'products.delete',
                    },
                    {
                        label: 'Thêm mới',
                        value: 'products.create',
                    },
                ],
            },
            {
                title: 'Danh mục sản phẩm',
                value: 'products/collections',
                childrent: [
                    {
                        label: 'Xem',
                        value: 'products/collections.view',
                    },
                    {
                        label: 'Chỉnh sửa',
                        value: 'products/collections.update',
                    },
                    {
                        label: 'Xóa',
                        value: 'products/collections.delete',
                    },
                    {
                        label: 'Thêm mới',
                        value: 'products/collections.create',
                    },
                ],
            },
        ],
    },
    {
        title: 'Tin tức',
        childrent: [
            {
                title: 'Chuyên mục',
                value: 'blogs/categories',
                childrent: [
                    {
                        label: 'Xem',
                        value: 'blogs.categories.view',
                    },
                    {
                        label: 'Chỉnh sửa',
                        value: 'blogs.categories.update',
                    },
                    {
                        label: 'Xóa',
                        value: 'blogs.categories.delete',
                    },
                    {
                        label: 'Thêm mới',
                        value: 'blogs.categories.create',
                    },
                ],
            },
            {
                title: 'Bài viết',
                value: 'blogs',
                childrent: [
                    {
                        label: 'Xem',
                        value: 'blogs.view',
                    },
                    {
                        label: 'Chỉnh sửa',
                        value: 'blogs.update',
                    },
                    {
                        label: 'Xóa',
                        value: 'blogs.delete',
                    },
                    {
                        label: 'Thêm mới',
                        value: 'blogs.create',
                    },
                ],
            },
        ],
    },
    {
        title: 'Cài đặt',
        childrent: [
            {
                title: 'Cài đặt',
                value: 'setting',
            },
        ],
    },
];
