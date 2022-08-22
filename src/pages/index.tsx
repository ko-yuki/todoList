import styles from './index.less';
import { Form, Input, Checkbox, Card, Button, Tooltip, message, Empty, Row, Col, Popconfirm } from 'antd';
import { useState, useEffect } from 'react';

interface Task {
  title: string;
  key: number;
  remark?: string;
}

interface State {
  todoList: Task[];
  doneList: Task[];
}

interface DeleteState {
  todoList: number[];
  doneList: number[];
}

message.config({
  top: 100,
  duration: 2,
  maxCount: 2,
});

export default function IndexPage() {

  const [state, setState] = useState<State>({ todoList: [], doneList: [] });
  const [deleteState, setDeleteState] = useState<DeleteState>({ todoList: [], doneList: [] });
  const addForm = Form.useForm();
  const todoForm = Form.useForm();
  const doneForm = Form.useForm();

  // 初始化从localStorage中获取任务列表
  useEffect(() => {
    const todoList: Task[] = JSON.parse(localStorage.getItem('todo')!) || [];
    const doneList: Task[] = JSON.parse(localStorage.getItem('done')!) || [];
    setState({ todoList, doneList });
  }, []);

  // 监听任务列表的变化并保存在本地
  useEffect(() => {
    localStorage.setItem('todo', JSON.stringify(state.todoList));
    localStorage.setItem('done', JSON.stringify(state.doneList));
  }, [state.todoList, state.doneList]);

  // 添加任务
  function handelAdd(value: Task) {
    const todoList = [...state.todoList];
    const key = (new Date()).getTime();
    todoList.push({ ...value, key });
    setState({ ...state, todoList });
    message.success('添加成功！');
    addForm[0].resetFields();
  }

  // 完成任务
  function handelFinish(value: { todoList: number[] }) {
    const { todoList, doneList } = state;
    // 已完成
    const done = todoList.filter(t => value.todoList.includes(t.key));
    const newDoneList = [...doneList];
    newDoneList.push(...done);
    // 剩余
    const has = todoList.filter(t => !value.todoList.includes(t.key));

    setState({ todoList: has, doneList: newDoneList });
    setDeleteState({ ...deleteState, todoList: [] });

    todoForm[0].resetFields();
    doneForm[0].resetFields();
  }

  // 撤销已完成
  function handelRevoke(value: { doneList: number[] }) {
    const { todoList, doneList } = state;
    // 已撤销
    const todo = doneList.filter(t => value.doneList.includes(t.key));
    const newTodoList = [...todoList];
    newTodoList.push(...todo);
    // 剩余
    const has = doneList.filter(t => !value.doneList.includes(t.key));

    setState({ todoList: newTodoList, doneList: has });
    setDeleteState({ ...deleteState, doneList: [] });

    todoForm[0].resetFields();
    doneForm[0].resetFields();
  }

  // 删除未完成
  function handelDeleteTodo() {
    const { todoList } = deleteState;
    const newTodoList = state.todoList.filter(t => !todoList.includes(t.key));
    setState({ ...state, todoList: newTodoList });
    setDeleteState({ ...deleteState, todoList: [] });

    message.success('删除成功！');
  }

  // 删除已完成
  function handelDeleteDone() {
    const { doneList } = deleteState;
    const newDoneList = state.doneList.filter(t => !doneList.includes(t.key));
    setState({ ...state, doneList: newDoneList });
    setDeleteState({ ...deleteState, doneList: [] });

    message.success('删除成功！');
  }

  return (
    <div className={styles.container}>
      <div className={styles.taskListBox}>
        <div className={styles.taskBox}>
          <Card bordered title='待完成任务'>
            {
              state.todoList.length ?
                <Form
                  onFinish={handelFinish}
                  initialValues={{ todoList: [...state.todoList] }}
                  onValuesChange={v => setDeleteState({ ...deleteState, todoList: v.todoList || [] })}
                  form={todoForm[0]}
                >
                  <Row gutter={30}>
                    <Col>
                      <Form.Item>
                        <Button type='primary' htmlType='submit'>完成</Button>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item>
                        <Popconfirm
                          title='确定删除选中项？'
                          onConfirm={handelDeleteTodo}
                          okText='确认'
                          cancelText='取消'
                          disabled={deleteState.todoList.length === 0}
                        >
                          <Button danger type='primary' disabled={deleteState.todoList.length === 0}>删除</Button>
                        </Popconfirm>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name='todoList' className={styles.todoListBox}>
                    <Checkbox.Group>
                      {state.todoList.map(t => (
                        <div key={t.key} className={styles.todoItem}>
                          {t.remark ?
                            <Tooltip title={t.remark}>
                              <Checkbox value={t.key}>{t.title}</Checkbox>
                            </Tooltip> :
                            <Checkbox value={t.key}>{t.title}</Checkbox>}
                        </div>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>
                </Form> :
                <Empty description='全部完成啦' />
            }
          </Card>
          <Card bordered title='已完成任务'>
            {
              state.doneList.length ?
                <Form
                  onFinish={handelRevoke}
                  initialValues={{ doneList: [...state.doneList] }}
                  onValuesChange={v => setDeleteState({ ...deleteState, doneList: v.doneList || [] })}
                  form={doneForm[0]}
                >
                  <Row gutter={30}>
                    <Col>
                      <Form.Item>
                        <Button type='primary' htmlType='submit'>撤销</Button>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item>
                        <Popconfirm
                          title='确定删除选中项？'
                          onConfirm={handelDeleteDone}
                          okText='确认'
                          cancelText='取消'
                          disabled={deleteState.doneList.length === 0}
                        >
                          <Button danger type='primary' htmlType='submit' disabled={deleteState.doneList.length === 0}>删除</Button>
                        </Popconfirm>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name='doneList' className={styles.doneListBox}>
                    <Checkbox.Group>
                      {state.doneList.map(t => (
                        <div key={t.key} className={styles.doneItem}>
                          <Checkbox value={t.key}>{t.title}</Checkbox>
                        </div>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>
                </Form> :
                <Empty description='空空如也' />
            }
          </Card>
        </div>
      </div>
      <Card title='请添加任务' className={styles.addTask}>
        <Form onFinish={handelAdd} initialValues={{ title: '', remark: '', checked: false }} form={addForm[0]}>
          <Form.Item name='title' label='任务' rules={[{ required: true, message: '请输入任务标题！' }]}>
            <Input placeholder='请输入任务标题' />
          </Form.Item>
          <Form.Item name='remark' label='备注'>
            <Input.TextArea placeholder='请输入备注' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>添加</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
