# Vector的常用函数方法 

vector是C++标准模板库中的部分内容，中文偶尔译作“容器”，但并不准确。它是一个多功能的，能够操作多种数据结构和算法的模板类和函数库。vector之所以被认为是一个容器，是因为它能够像容器一样存放各种类型的对象，简单地说，vector是一个能够存放任意类型的动态数组，能够增加和压缩数据。

vector<int> test;//建立一个vector
　　test.pushback(1);//把1和2压入vector 这样test[0]就是1,test[1]就是2
　　test.pushback(2);
　　我们可以用一个迭代器：
　　vector<int>::iterator iter=text.begin();//定义一个可以迭代int型vector的迭代器iter，它指向text的首位
　　while(;iter!=text.end();iter++) 
cout<<(*iter);//iter++指的是向前迭代一位，直到iter到超出末端迭代器为止，输出迭代器指向的值



	c.assign(beg,end)
    c.assign(n,elem)
    将[beg; end)区间中的数据赋值给c。将n个elem的拷贝赋值给c。
    c.at(idx)	传回索引idx所指的数据，如果idx越界，抛出out_of_range。
    c.back() 传回最后一个数据，不检查这个数据是否存在。
    c.begin()传回迭代器中的第一个数据地址。
    c.capacity()返回容器中数据个数。
    c.clear()移除容器中所有数据。
    c.empty()判断容器是否为空。
    c.end()指向迭代器中末端元素的下一个，指向一个不存在元素
    c.erase(pos)
    c.erase(beg,end)
　　删除pos位置的数据，传回下一个数据的位置。
　　删除(beg,end)区间的数据，传回下一个数据的位置。
　
　
```c.front() 传回第一个数据。
　　get_allocator 使用构造函数返回一个拷贝。
　　c.insert(pos,elem)
　　c.insert(pos,n,elem)
　　c.insert(pos,beg,end)
　　
　　在pos位置插入一个elem拷贝，传回新数据位置。
　　在pos位置插入n个elem数据。无返回值。
　　在pos位置插入在[beg,end)区间的数据。无返回值。
```