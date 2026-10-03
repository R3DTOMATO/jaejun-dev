---
title: "Intro to Operating System"
categoryId: "computer-science"
category: "Computer Science"
createdAt: "2026-10-02"
updatedAt: "2026-10-02"
status: "Learning"
---

# Operating System이란?

운영체제는 **사용자 프로그램과 하드웨어 사이에서 컴퓨터 자원을 관리하는 시스템 소프트웨어**다.

컴퓨터에는 CPU, 메모리, 저장장치와 같은 다양한 자원이 존재한다.

운영체제는 이러한 자원을 여러 프로그램이 안정적으로 사용할 수 있도록 관리한다.


# What a happens when a program runs?
CPU가 메모리에서 명령어를 가져오고(fetch), 무슨 명령어인지 해석하고(decode), 실행한 뒤(execute), 다음 명령어로 이동한다.

```c
int a = 10;
int b = 20;
int c = a+b;
```

위와 같은 c 코드가 있다
사람에게는 간단한 코드이지만 CPU 입장에서는 대략 이런 동작이 필요하다.

```text
메모리에서 a 값을 가져온다.
메모리에서 b 값을 가져온다.
두 값을 더한다.
결과를 c가 저장될 위치에 기록한다.
```

CPU의 기본 사이클을 단순화하면 다음과 같다.
```text
Memory
  ↓
Fetch
  ↓
Decode
  ↓
Execute
  ↓
다음 명령
```

__*Fetch*__
CPU가 메모리에서 다음 명령어를 가져온다.
예를 들어,
```asm
ADD R1, R2
```
같은 기계어 명령어이다.

__*Decode*__
가져온 비트 패턴이 어떤 명령인지 해석한다.
```text
이건 ADD명령어다.
R1과 R2를 더해야 한다.
```

__*Execute*__
실제로 연산한다.
```text
두 수 더하기
메모리 접근
조건 검사
함수로 점프
```

이런 과정을 수십억 번 반복된다.

# Operating System
프로그램을 쉽게 실행하게 해주고, 여러 프로그램이 메모리를 사용할 수 있게 하고, 프로그램이 장치와 상호작용할 수 있도록 한다. 그리고 시스템이 올바르고 효율적으로 동작하도록 관리한다.

보통 프로그램은 OS에게 요청한다.
```text
프로그램
   ↓
운영체제
   ↓
  SSD
```

chrome이 파일을 저장한다고 생각해 보자.
chrome이 SSD 컨트롤러를 직접 제어하기 보다는
```text
"OS야 , 이 파일을 저장해줘"
```
라고 요청한다.

OS는 파일 시스템, 장치 드라이버등을 통해 실제 하드웨어 작업을 처리한다.

즉,
```text
Application
     ↓
Operating System
     ↓
  Hardware
```

# Virtualization
**OS가 물리적 자원을 가져와 그것의 가상형태(virtual form)로 변환한다.**

각 프로그램은 물리적 자원을 자신만의 공간이 있는 것처럼 느끼는 것이 **Virtualization**이다.

Physical resource --> Virtual resource

# System Call
프로그램은 OS에게 일을 요청해야 한다. 그때 사용하는 핵심 인터페이스가 **System Call**이다.

System call을 사용자가 OS에게 무엇을 해달라고 요청할 수 있게 하는 방법.
OS는 API나 표준 라이브러리 형태의 인터페이스를 제공하며, 일반적인 OS는 수백 개 정도의 system call을 제공한다.

예를 들어 Linux에서:
```c
write(...)
```
를 이용하면 파일이나 출력 장치에 데이터를 쓸 수 있습니다.

```text
User Program
      ↓
System Call
      ↓
Kernel
      ↓
Hardware
```

프러그램이
```c
open("hello.txt",...);
```
를 수행한다면

```text
프로그램
   ↓
open()
   ↓
OS Kernel
   ↓
File System
   ↓
Disk
```
와 같은 흐름이 발생한다.

중요한 이유가 있다
프로그램이 하드웨어를 마음대로 제어하게 하면 위험하다.

하나의 프로그램이
```text
다른 프로그램 메모리 삭제
디스크 임의 덮어쓰기
네트워크 장치 독점
```
등을 할 수 있기 때문에 OS가 중간에서 통제한다.

# OS는 Resource Manager이다.
**The OS is a resource manager**
OS가 CPU, Memory, disk 같은 자원을 관리한다.

# Virtualizing the CPU
하나의 CPU를 마치 매우 많은 CPU가 존재하는 것처럼 보이게 한다.
실제로는 CPU 실행 시간을 매우 짧게 나눠 사용하는 것이다.

# CPU 가상화 실험코드
```c
//cpu.c
#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>
#include <assert.h>
#include "common.h"

int main(int argc, char *argv[]){
    if(argc != 2){
        fprintf(stderr, "usage: cpu <string>\n");
        exit(1);
    }
    char *str = argv[1];
    while(1){
        Spin(1); //Repeatedly checks the time and returns once it has run for a second
        printf("%s\n", str);
    }
    return 0;
}
```
argv[1] 은 프로그램 실행 시 전달한 문자열이다.
예를 들어 
```bash 
./cpu A 
```
라고 실행하면
argv[1]은 "A"이다.

따라서 char *str = argv[1];로 인해: str-> "A"가 된다.

while(1)
무한 루프이다.

Spin(1)
약 1초 동안 반복적으로 시간을 확인하다가 반환하는 함수이다.

```text
1초 기다림
A 출력
1초 기다림
A 출력
...
```

# CPU 가상화 프로그램 하나만 실행
```bash
gcc -o cpu cpu.c -Wall
./cpu "A"
```
결과 :
```text
A
A
A
A
...
```
gcc는 C 컴파일러이다.
cpu.c
 ↓ gcc
cpu

-o cpu는 실행 파일 이름을 cpu로 하라는 의미입니다.
-Wall은 여러 컴파일러 경고를 활성화합니다.

# 프로그램 4개 실행
프로세서가 하나뿐이어도 네 프로그램이 동시에 실행되는 것처럼 보인다.

시간 ─────────────────────────→

CPU:
[A] [B] [D] [C] [A] [B] [D] [C]

# Virtualizing Memory
물리 메모리는 byte의 배열이다. 프로그램의 데이터 구조가 메모리에 저장되며, 메모리를 읽을 때는 주소가 필요하고, 쓸 때는 주소와 쓸 값이 필요하다.

RAM을 아주 단순하게 보면:
```text
Address       Value
0x0000        13
0x0001        45
0x0002        78
0x0003        20
...
```

Read memory(Load)
메모리에서 값을 가져온다.
Memory -> CPU

Write Memory(Store)
CPU에서 값을 메모리에 저장한다.
CPU -> Memory

# Memory Virtualization 코드
```c
//mem.c
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include "common.h"

int main(int argc, char *argv[]){
    int *p = malloc(sizeof(int)); //a1: allocate some memory --> int 하나를 저장할 만큼의 메모리를 달라
    assert(p != NULL);
    printf("(%d) address of p: %08x\n", getpid(), (unsigned) p); //a2: print out the address of the memory
    *p = 0; //a3: put zero into the first slot of the memory
    while(1){
        Spin(1);
        *p = *p + 1;
        printf("(%d) p: %d\n", getpid(), *p); //a4
    }
    return 0;
}
```
malloc
동적으로 메모리를 할당합니다.

assert(p != NULL)
메모리 할당이 성공했는지 확인합니다.

# mem.c 실행 결과
```text
(2134) address of p: 00200000
(2134) p: 1
(2134) p: 2
(2134) p: 3
...
```

# mem.c를 두 개 동시에 실행
```text
Process A
00200000 → 1 → 2 → 3

Process B
00200000 → 1 → 2 → 3
```

Process A
Virtual 0x00200000
        ↓
Physical 0x12345000

Process B
Virtual 0x00200000
        ↓
Physical 0x98765000
따라서 두 프로그램은 서로 영향을 주지 않는다.

# Virtual Address Space
각 프로세스는 자신의 private virtual address space에 접근하고, OS가 그 주소 공간을 physical memory에 매핑한다. 한 프로세스의 메모리 참조가 다른 프로세스 주소 공간을 직접 건드리지 않도록 한다.

# The Problem of Concurrency
여러 실행 흐름이 같은 데이터를 동시에 수정하면 어떻게 되는가?
```text
Thread A ─┐
          ├→ counter
Thread B ─┘
```
# Multi-threaded Program
```c
#include <stdio.h>
#include <stdlib.h>
#include "common.h"

volatile int counter = 0;
int loops;

void *worker(void *arg){
    int i;
    for(i = 0; i < loops; i++){
        counter++;
    }
    return NULL;
}
```
loops = 1000

이면 한 thread가:
counter++

를 1000번 실행합니다.
thread가 두 개라면 상식적으로는:
1000 + 1000 = 2000

__*Thread란?*__
이 자료에서는 thread를 같은 메모리 공간 안에서 실행되는 함수 흐름으로 설명합니다.     
프로세스를 하나의 작업 공간이라고 한다면 thread는 그 안에서 일하는 작업자에 비유할 수 있습니다.

```text
Process

Memory
+---------------------+
| counter             |
| variables           |
+---------------------+

 Thread 1     Thread 2
    ↓            ↓
 worker()      worker()
 ```

 # Thread 생성
 ```c
 int main(int argc, char *argv[]){
    if(argc != 2){
        fprintf(stderr, "usage: threads <value>\n");
        exit(1);
    }
    loops = atoi(argv[1]);
    pthread_t p1, p2;
    printf("Initial value : %d\n", counter);

    Pthread_create(&p1, NULL, worker, NULL);
    Pthread_create(&p2, NULL, worker, NULL);
    Pthread_join(p1,NULL);
    Pthread_join(p2,NULL);
    printf("Final value : %d\n", counter);
    return 0;
 }
 ```

 # 예상과 다른 결과
 loops = 1000일 때는:
Final value : 2000

이 나왔습니다.
그런데 loops = 100000일 경우:
143012

또 실행하면:
137298

같은 값이 나옵니다.     00_OS_introduction
원래 기대값은:
100000 × 2
= 200000

입니다.
그런데 결과가:
143012
137298
...

처럼 달라집니다.
이 현상을 이해하는 것이 운영체제와 멀티스레딩에서 매우 중요합니다.
이것을 Race Condition이라고 합니다.
실행 순서에 따라 결과가 달라지는 문제입니다.


# 왜 문제가 발생하는가?
1. counter를 memory에서 
1. 값 증가
1. 다시 memory에 store

Atomicity
슬라이드에서 가장 중요한 표현은:
These three instructions do not execute atomically.     00_OS_introduction

Atomic은
실행 도중 다른 작업이 끼어들 수 없는 하나의 단위

라고 생각하면 됩니다.
원하는 형태는:
[Load → Add → Store]

전체가 하나의 작업처럼 실행되는 것입니다.
그런데 실제 상황은:
Thread A Load
Thread B Load
Thread A Add
Thread B Add
Thread A Store
Thread B Store

처럼 섞일 수 있습니다.
그래서 동시성 문제를 해결하려면 이후 운영체제에서:
Lock
Mutex
Semaphore
Condition Variable
Atomic operation

같은 개념을 배우게 됩니다.
한 가지 정확성 보충
슬라이드는 counter++을 3개의 instruction이라고 설명하지만, 이것은 이해를 위한 논리적 모델입니다. 실제 기계어 명령 수는 CPU 아키텍처와 컴파일 결과에 따라 달라질 수 있습니다.
핵심은 정확히 세 개냐가 아니라, counter++ 전체가 자동으로 atomic한 작업이 아니라는 것입니다.

# Persistence
**Persistence = 영속성**

즉:
전원을 껐다 켜도 데이터가 남아 있는가?

자료에서는 DRAM은 volatile이고, 데이터를 지속적으로 보관하려면 HDD나 SSD 같은 저장장치와 이를 관리하는 소프트웨어가 필요하다고 설명합니다. 파일 시스템이 디스크를 관리하고 사용자가 만든 파일을 저장합니다.

# 파일을 만드는 프로그램
```c
#include <stdio.h>
#include <unistd.h>
#include <assert.h>
#include <fcntl.h>
#include <sys/types.h>

int main(int argc, char *argv[]){
    int fd = open("/tmp/file", O_WRONLY | O_CREAT | O_TRUNC, S_IRWXU);
    assert(fd > -1);
    int rc = write(fd, "hello world\n", 13);
    assert(rc == 13);
    close(fd);
    return 0;
}
```
open()
파일을 엽니다.

O_WRONLY
쓰기 전용으로 엽니다.
O_CREAT
파일이 없으면 만듭니다.
O_TRUNC
파일이 이미 존재하면 기존 내용을 잘라내고 처음부터 쓰게 합니다.

fd는 file descriptor입니다.

# 실제 디스크에 쓰려면 OS가 해야 하는 일
디스크 저장위치 결정, 저장장치에 I/O요청을 내려야 한다. 또한 쓰기 도중 시스템이 갑자기 꺼지는 문제도 처리해야 한다.

```text
어디에 저장할까?
      ↓
공간 할당
      ↓
Storage I/O 요청
      ↓
Metadata 갱신
```
```text
그런데 중간에 정전이 발생하면 어떻게 될까요?
파일 데이터 일부 기록
        ↓
전원 OFF
        ↓
파일 시스템 상태 불일치

가 발생할 수 있습니다.
```

**Journaling**
중요한 변경을 하기 전에 기록을 남겨두는 방식입니다.
대략:
```text
"이 변경을 할 예정이다"
        ↓
journal 기록
        ↓
실제 변경
```
그래서 갑자기 시스템이 꺼져도 journal을 보고 복구할 수 있습니다.

**Copy-on-write**
기존 데이터를 바로 덮어쓰기보다 새 위치에 새 버전을 작성한 뒤 전환하는 방식입니다.
개념적으로:
```
Old Data

    ↓ 새 복사본 생성

New Data

    ↓ 완료 후 연결 변경

New Data 사용
```
입니다.

# OS Design Goals
Abstraction
복잡한 하드웨어를 사용하기 쉽게 만듭니다.
예를 들어 사용자는 SSD의 어느 sector에 파일을 저장할지 직접 계산하지 않습니다.
그냥:
open("hello.txt");

라고 합니다.
복잡한:
Disk sectors
blocks
device commands
controllers

를
File

이라는 단순한 개념으로 만들어 줍니다.
이것이 Abstraction입니다.
High Performance
OS는 편리함을 제공해야 하지만 너무 느려져서는 안 됩니다.
예를 들어:
Program
↓
OS
↓
Hardware

에서 OS가 지나치게 많은 작업을 하면 성능 저하가 발생합니다.
그래서 슬라이드는:
virtualization을 제공하되 excessive overhead가 없어야 한다

고 설명합니다.     00_OS_introduction
Overhead는 본 작업 자체가 아니라 관리 때문에 추가로 발생하는 비용입니다.
예를 들어 실제 계산 시간이:
100 ms

인데 OS 관리 때문에:
50 ms

가 추가된다면 상당한 overhead입니다.
Protection / Isolation
프로그램 하나가 잘못됐다고 다른 프로그램이나 OS까지 망가지면 안 됩니다.
예를 들어:
Program A crash

가 일어났을 때:
Program B
Program C
OS

까지 모두 망가지는 것은 좋지 않은 설계입니다.
OS는:
Process A
| 격리 |
Process B
| 격리 |
Kernel

처럼 보호해야 합니다.
슬라이드에서는 이를:
Bad behavior of one does not harm other and the OS itself.     00_OS_introduction

라고 설명합니다.
이것이 Isolation입니다.

# Reliability, Energy, Security, Mobility
Reliability
OS는 사실상 계속 실행되어야 합니다.
일반 프로그램은:
Chrome crash

후 다시 실행하면 됩니다.
하지만 OS가 crash하면:
전체 시스템 사용 불가

가 될 수 있습니다.
그래서 운영체제는 매우 높은 안정성을 요구합니다.
Energy Efficiency
특히 노트북과 스마트폰에서 중요합니다.
CPU를 계속 최고 속도로 동작시키면:
성능 ↑
전력 소비 ↑
발열 ↑
배터리 시간 ↓

가 됩니다.
따라서 OS는 상황에 따라 CPU, 디스플레이, 네트워크 장치 등의 전력 사용을 관리합니다.
Security
운영체제는 시스템에서 가장 중요한 보안 계층 중 하나입니다.
예를 들어:
파일 접근 권한
프로세스 권한
사용자 인증
메모리 보호
장치 접근

등을 관리해야 합니다.
Mobility
모바일 환경에서는:
배터리
무선 네트워크
센서
터치스크린
위치 변화

등도 중요해집니다.
그래서 현대 OS는 데스크톱 PC뿐 아니라 스마트폰, 태블릿, 임베디드 시스템 등 다양한 환경을 고려해야 합니다.


@R3DTOMATO