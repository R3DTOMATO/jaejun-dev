---
title: "Operating Systems"
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

## 운영체제의 주요 역할

운영체제는 대표적으로 다음 기능을 수행한다.

- CPU 스케줄링
- 메모리 관리
- 파일 시스템 관리
- 입출력 장치 관리
- 프로세스 관리
- 사용자와 하드웨어 사이의 인터페이스 제공

## Kernel

커널은 운영체제의 핵심 부분이다.

Linux에서는 커널이 다음과 같은 역할을 담당한다.

```text
Application
    ↓
System Call
    ↓
Linux Kernel
    ↓
Hardware