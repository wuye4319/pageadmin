export const columns = {
  content: [
    {
      title: 'id',
      dataIndex: 'name'
    },
  ],
  struct: [
    {
      title: '字段名',
      dataIndex: 'column_name',
      scopedSlots: { customRender: 'column_name' },
    },
    {
      title: '字段类型',
      dataIndex: 'data_type',
      scopedSlots: { customRender: 'data_type' },
    },
    {
      title: '备注',
      dataIndex: 'mark',
      scopedSlots: { customRender: 'mark' },
    },
    {
      title: '操作',
      dataIndex: 'operate',
      scopedSlots: { customRender: 'operation' }
    }
  ]
}
