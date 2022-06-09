// Sample data of categories
const categories = [
  // vehicle category
  {
    _id: 1,
    category: "Vehicle",
    subCategory: [
      {
        list_name: "car",
        nest_name: "brand",
        nest_list: [
          {
            list_name: "tesla",
            nest_name: "model",
            nest_list: [
              { list_name: "model X", nest_name: null, nest_list: [] },
              { list_name: "model Y", nest_name: null, nest_list: [] },
              { list_name: "model 3", nest_name: null, nest_list: [] },
            ],
          },
          {
            list_name: "mercedes",
            nest_name: "model",
            nest_list: [
              { list_name: "B class", nest_name: null, nest_list: [] },
              { list_name: "C class", nest_name: null, nest_list: [] },
              { list_name: "CLA", nest_name: null, nest_list: [] },
            ],
          },
        ],
      },
      {
        list_name: "truck",
        nest_name: "brand",
        nest_list: [
          {
            list_name: "iveco",
            nest_name: "model",
            nest_list: [
              {
                list_name: "astira",
                nest_name: "type",
                nest_list: [
                  { list_name: "single", nest_name: null, nest_list: [] },
                  { list_name: "double", nest_name: null, nest_list: [] },
                ],
              },
              {
                list_name: "magirus",
                nest_name: null,
                nest_list: [],
              },
            ],
          },
        ],
      },
    ],
    createdAt: "2022-04-19T11:06:49.562Z",
    description: "All vehicle type under post to sell",
    categoryImage: "uploads/category/9823842398hsahjk90rwey32.jpg",
  },

  // Fashion category
  {
    _id: 2,
    category: "Fashion",
    subCategory: [
      {
        list_name: "men",
        nest_name: "brand",
        nest_list: [
          {
            list_name: "nike",
            nest_name: "type",
            nest_list: [
              {
                list_name: "t-shirt",
                nest_name: "size",
                nest_list: [
                  { list_name: "small", nest_name: null, nest_list: [] },
                  { list_name: "medium", nest_name: null, nest_list: [] },
                  { list_name: "large", nest_name: null, nest_list: [] },
                ],
              },
              {
                list_name: "hoodie",
                nest_name: "size",
                nest_list: [
                  { list_name: "small", nest_name: null, nest_list: [] },
                  { list_name: "medium", nest_name: null, nest_list: [] },
                  { list_name: "large", nest_name: null, nest_list: [] },
                ],
              },
            ],
          },
        ],
      },
    ],
    createdAt: "2022-04-19T11:06:49.562Z",
    description: "All fashions like men, women and kids fashions.",
    categoryImage: "uploads/category/9823842398hsahjk90rwey32.jpg",
  },
];
