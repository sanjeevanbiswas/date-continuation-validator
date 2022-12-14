import React, { useState } from 'react';
import moment from 'moment';
import DatePicker from 'react-date-picker';
import { Layout, theme, Button, Space, Typography, Timeline, Table, Empty, Image, Tag } from 'antd';
import { AimOutlined, CalendarOutlined, DeleteOutlined } from '@ant-design/icons';
import './App.css';
import 'react-date-picker/dist/DatePicker.css';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;
const DATE_FORMATS = [
  "MM-DD-YYYY", "M-DD-YYYY", "MM-D-YYYY", "M-D-YYYY", "MM-DD-YY", "M-DD-YY", "MM-D-YY", "M-D-YY",
  "YYYY-MM-DD", "YYYY-M-DD", "YYYY-MM-D", "YYYY-M-D", "MM/DD/YYYY", "M/DD/YYYY", "MM/D/YYYY",
  "M/D/YYYY", "MM/DD/YY", "M/DD/YY", "MM/D/YY", "M/D/YY", "YYYY/MM/DD",
  "YYYY/M/DD", "YYYY/MM/D", "YYYY/M/D"
];

const THRESHOLD_DAYS = 28;

export interface IDate {
  order: number;
  start: any;
  end: any;
}

const getDuration = (date1: any, date2: any): any => {

  let dateA = moment(date1),
    dateB = moment(date2);

  let a = dateA.diff(dateB, 'days');
  return a;
};

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [dateList, setDateList] = useState<IDate[]>([]);
  //const [monthSelector, setMonthSelector] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();

  const columns = [
    {
      title: 'Start Date',
      key: 'startDate',
      render: (_: string, field: IDate) => (
        <Text>{formatDate(field.start)}</Text>
      ),
    },
    {
      title: 'End Date',
      key: 'endDate',
      render: (_: string, field: IDate) => (
        <Text>{formatDate(field.end)}</Text>
      ),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_: string, field: IDate, index: number) => (
        <Text>{getDuration(field.end, field.start)}</Text>
      ),
    },
    {
      title: 'Gap',
      key: 'Gap',
      render: (_: string, field: IDate, index: number) => {
        let gapsInDays = index > 0 ? getDuration(field.start, dateList[index - 1].end) : '';
        return (
          gapsInDays ? <Tag color={gapsInDays <= THRESHOLD_DAYS ? "success" : "error"}>{gapsInDays}</Tag> : null
        )
      },
    },
    {
      title: '',
      key: 'action',
      width: '30px',
      render: (_: string, field: IDate, index: number) => (
        <Button
          type="text"
          key={`deleteBtn-${index}`}
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            setDateList((state: IDate[]) => {
              let datesArr = [...state];
              datesArr.splice(index, 1);
              return datesArr;
            });
          }}
        />
      ),
    },
  ];

  const formatDate = (date: any) : string => moment(date).format('DD-MM-YYYY');

  const onFinish = () => {
    if (startDate && endDate) {
      setDateList((state: IDate[]) => {
        let values = [...state];
        values.push({ start: startDate, end: endDate, order: state.length });
        return values;
      });

      setStartDate('');
      setEndDate('');
    }
  };

  return (
    <Layout style={{ height: "calc(100vh - 26px)" }}>
      <Header className="header">
        <Image width={110} src="date-continuation-validator/logo.png" preview={false} />
        <div style={{ flexGrow: 2 }}></div>
      </Header>

      <Layout style={{ padding: '24px 0', background: colorBgContainer, height: "100%" }}>
        <Content style={{ padding: '0 24px' }}>
          <Space size={48}>
            <Space size="large">
              <Text strong>Start Date:</Text>
              <DatePicker
                className="ant-input"
                onChange={setStartDate}
                value={startDate}
                openCalendarOnFocus={false}
                dayPlaceholder="DD"
                monthPlaceholder="MM"
                yearPlaceholder="YYYY"
                calendarIcon={<CalendarOutlined />}
                clearIcon={null}
                required />
            </Space>

            <Space size="large">
              <Text strong>End Date:&nbsp;&nbsp;</Text>
              <DatePicker
                className="ant-input"
                onChange={setEndDate}
                value={endDate}
                openCalendarOnFocus={false}
                dayPlaceholder="DD"
                monthPlaceholder="MM"
                yearPlaceholder="YYYY"
                calendarIcon={<CalendarOutlined />}
                clearIcon={null}
                required />
            </Space>

            <Button type="primary" htmlType="submit" onClick={onFinish}>
              Add Dates
            </Button>
          </Space>

          <Layout hasSider className="reportLayout">
            <Sider theme="light" width="20vw" className="timelineSider">
              {!dateList.length ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <Timeline>
                  {
                    dateList.map((field: IDate, index: number) => {
                      let gapsInDays = index > 0 ? getDuration(field.start, dateList[index - 1].end) : '';
                      return ([
                        index > 0 ? (
                          <Timeline.Item dot={<AimOutlined />}>
                            <Space>
                              <Tag color={gapsInDays <= THRESHOLD_DAYS ? "success" : "error"}>{`${gapsInDays} days`}</Tag>
                            </Space>
                          </Timeline.Item>
                        ) : null,
                        <Timeline.Item dot={<CalendarOutlined style={{ fontSize: '16px' }} />}>
                          <Space>
                            <Text strong>Start Date: </Text>
                            <Text>{formatDate(field.start)}</Text>
                          </Space>
                        </Timeline.Item>,
                        <Timeline.Item>
                          <Space>
                            <Text>{getDuration(field.end, field.start)} days</Text>
                          </Space>
                        </Timeline.Item>,
                        <Timeline.Item dot={<CalendarOutlined style={{ fontSize: '16px' }} />}>
                          <Space>
                            <Text strong>End Date: </Text>
                            <Text>{formatDate(field.end)}</Text>
                          </Space>
                        </Timeline.Item>
                      ])
                    })
                  }
                </Timeline>
              )}
            </Sider>
            <Content>
              <Table
                pagination={false}
                columns={columns}
                dataSource={dateList} />
            </Content>
          </Layout>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;